const { expect } = require('@playwright/test');

class ProviderAPI {
    constructor(request, baseURL = process.env.PROVIDER_API_BASE_URL || 'https://qa1-nhconnect.nirvanahealth.com') {
        this.request = request;
        this.baseURL = baseURL.replace(/\/$/, '');
        this.csrfToken = null;
        this.xsrfCookie = null;
        this.initialPageResponse = null;
        this.initialPageBody = '';
    }

    get publicPcpSearchUrl() {
        return `${this.baseURL}/Provider/PublicPcpSearch`;
    }

    get searchProviderListUrl() {
        return `${this.baseURL}/Provider/SearchProviderList`;
    }

    buildPublicPcpSearchUrl(params = {}) {
        const url = new URL(this.publicPcpSearchUrl);
        const defaults = {
            mode: 'E',
            planId: 'H9808004000',
            planName: 'HealthTeamAdvantageI',
            planYear: '',
            enrollmentDate: '10/01/2026'
        };

        Object.entries({ ...defaults, ...params }).forEach(([key, value]) => {
            url.searchParams.set(key, value == null ? '' : String(value));
        });
        return url.toString();
    }

    async initializePublicPcpSearch(params = {}) {
        const url = this.buildPublicPcpSearchUrl(params);
        const response = await this.request.get(url, {
            headers: {
                Accept: 'text/html,application/xhtml+xml',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        this.initialPageResponse = response;
        this.initialPageBody = await response.text();
        this.csrfToken = ProviderAPI.extractRequestVerificationToken(this.initialPageBody);
        this.xsrfCookie = await this.getCookie('XSRF-TOKEN');

        return {
            response,
            body: this.initialPageBody,
            csrfToken: this.csrfToken,
            xsrfCookie: this.xsrfCookie,
            url
        };
    }


    async getCookie(cookieName) {
        const state = await this.request.storageState();
        return state.cookies.find(cookie => cookie.name === cookieName) || null;
    }


    async getCookies() {
        const state = await this.request.storageState();
        return state.cookies;
    }


    static extractRequestVerificationToken(html) {
        if (!html) return null;
        const inputTags = html.match(/<input\b[^>]*>/gi) || [];

        for (const tag of inputTags) {
            if (/name\s*=\s*["']__RequestVerificationToken["']/i.test(tag)) {
                const valueMatch = tag.match(/value\s*=\s*["']([^"']*)["']/i);
                if (valueMatch) return valueMatch[1];
            }
        }

        const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
        for (const tag of metaTags) {
            if (/name\s*=\s*["']__RequestVerificationToken["']/i.test(tag)) {
                const valueMatch = tag.match(/content\s*=\s*["']([^"']*)["']/i);
                if (valueMatch) return valueMatch[1];
            }
        }
        return null;
    }

    async searchProviderList(payload = {}, options = {}) {
        const { includeDynamicToken = true, preserveDuplicatePcpOnly = true } = options;

        // Ordered form entries support duplicate keys (as in the captured browser request).
        const entries = [
            ['NewLocation', payload.NewLocation ?? ''],
            ['CmsPlanId', payload.CmsPlanId ?? 'H9808004000'],
            ['PageName', payload.PageName ?? 'PCP'],
            ['ReferredBy', payload.ReferredBy ?? 'Embedded'],
            ['RedirectUrl', payload.RedirectUrl ?? ''],
            ['BusinessId', payload.BusinessId ?? '109'],
            ['SelectProvider', payload.SelectProvider ?? 'False'],
            ['DomId', payload.DomId ?? ''],
            ['EnrollmentDate', payload.EnrollmentDate ?? '10/1/2026 12:00:00 AM'],
            ['SelectionCallback', payload.SelectionCallback ?? ''],
            ['UseMapView', payload.UseMapView ?? ''],
            ['BenefitPlanId', payload.BenefitPlanId ?? '15318'],
            ['Location', payload.Location ?? ''],
            ['Longitude', payload.Longitude ?? ''],
            ['Latitude', payload.Latitude ?? ''],
            ['Miles', payload.Miles ?? '5'],
            ['pfname', payload.pfname ?? 'john']
        ];

        const pcpOnlyValues = payload.PcpOnlyValues ??
            (preserveDuplicatePcpOnly ? ['true', 'false'] : [payload.PcpOnly ?? 'true']);
        for (const value of pcpOnlyValues) entries.push(['PcpOnly', String(value)]);

        // Prefer a fresh hidden anti-forgery token obtained from the GET page.
        const token = includeDynamicToken ? this.csrfToken : null;
        if (token) entries.push(['__RequestVerificationToken', token]);
        else if (payload.__RequestVerificationToken) entries.push(['__RequestVerificationToken', payload.__RequestVerificationToken]);

        entries.push(['AcceptingPatients', payload.AcceptingPatients ?? 'false']);
        const formBody = new URLSearchParams(entries).toString();

        return this.request.post(this.searchProviderListUrl, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                Accept: '*/*',
                'X-Requested-With': 'XMLHttpRequest',
                Referer: this.publicPcpSearchUrl
            },
            data: formBody
        });
    }


    static assertCookieAttributes(cookie, expected = {}) {
        expect(cookie, 'Expected XSRF-TOKEN cookie to be present').toBeTruthy();
        if (!cookie) return;
        if (expected.secure !== undefined) expect(cookie.secure).toBe(expected.secure);
        if (expected.path !== undefined) expect(cookie.path).toBe(expected.path);
        if (expected.sameSite !== undefined) expect(cookie.sameSite).toBe(expected.sameSite);
    }
}


module.exports = ProviderAPI;
