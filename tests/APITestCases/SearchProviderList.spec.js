const { test, expect } = require('@playwright/test');
const ProviderAPI = require('../../Utils/API/ProviderAPI.js');

test.describe('Provider API - SearchProviderList (POST)', () => {
    test('API_PCP_101 - Search providers using valid first name', async ({ request }) => {
        const api = new ProviderAPI(request);
        const init = await api.initializePublicPcpSearch();
        expect(init.response.status()).toBe(200);
        expect(init.xsrfCookie).toBeTruthy();

        const response = await api.searchProviderList({
            pfname: 'john', BusinessId: '109', BenefitPlanId: '15318',
            CmsPlanId: 'H9808004000', Miles: '5',
            EnrollmentDate: '10/1/2026 12:00:00 AM',
            PcpOnlyValues: ['true', 'false'], AcceptingPatients: 'false'
        });
        const body = await response.text();
        expect(response.status()).toBe(200);
        expect(body).toBeTruthy();
        console.log('Provider search status:', response.status());
        console.log('Provider search response length:', body.length);
        console.log('Provider search preview:', body.substring(0, 300));
    });


    test('API_PCP_102 - Search using a name expected to return no matches', async ({ request }) => {
        const api = new ProviderAPI(request);
        const init = await api.initializePublicPcpSearch();
        expect(init.response.status()).toBe(200);

        const response = await api.searchProviderList({
            pfname: 'zzzz_no_provider_match_987654', BusinessId: '109',
            BenefitPlanId: '15318', CmsPlanId: 'H9808004000', Miles: '5',
            PcpOnlyValues: ['true'], AcceptingPatients: 'false'
        });
        const body = await response.text();
        expect(response.status()).toBeLessThan(500);
        expect(body).toBeTruthy();
        // Assert the exact empty-results message/markup after response format is confirmed.
        console.log('No-match search status:', response.status());
        console.log('No-match response preview:', body.substring(0, 300));
    });


    test('API_PCP_103 - Search with blank provider first name', async ({ request }) => {
        const api = new ProviderAPI(request);
        const init = await api.initializePublicPcpSearch();
        expect(init.response.status()).toBe(200);

        const response = await api.searchProviderList({
            pfname: '', BusinessId: '109', BenefitPlanId: '15318',
            CmsPlanId: 'H9808004000', Miles: '5',
            PcpOnlyValues: ['true'], AcceptingPatients: 'false'
        });
        const body = await response.text();
        expect(response.status()).toBeLessThan(500);
        expect(body).toBeTruthy();
    });


    test('API_PCP_104 - Search using invalid BenefitPlanId', async ({ request }) => {
        const api = new ProviderAPI(request);
        const init = await api.initializePublicPcpSearch();
        expect(init.response.status()).toBe(200);

        const response = await api.searchProviderList({
            pfname: 'john', BusinessId: '109', BenefitPlanId: 'INVALID',
            CmsPlanId: 'H9808004000', Miles: '5',
            PcpOnlyValues: ['true'], AcceptingPatients: 'false'
        });
        const body = await response.text();
        expect(response.status()).toBeLessThan(500);
        expect(body).toBeTruthy();
    });


    test('API_PCP_105 - Search with PCP-only filter enabled', async ({ request }) => {
        const api = new ProviderAPI(request);
        const init = await api.initializePublicPcpSearch();
        expect(init.response.status()).toBe(200);

        const response = await api.searchProviderList({
            pfname: 'john', BusinessId: '109', BenefitPlanId: '15318',
            CmsPlanId: 'H9808004000', Miles: '5',
            PcpOnlyValues: ['true'], AcceptingPatients: 'false'
        });
        expect(response.status()).toBe(200);
        expect(await response.text()).toBeTruthy();
    });


    test('API_PCP_106 - Search with accepting-patients filter enabled', async ({ request }) => {
        const api = new ProviderAPI(request);
        const init = await api.initializePublicPcpSearch();
        expect(init.response.status()).toBe(200);

        const response = await api.searchProviderList({
            pfname: 'john', BusinessId: '109', BenefitPlanId: '15318',
            CmsPlanId: 'H9808004000', Miles: '5',
            PcpOnlyValues: ['true'], AcceptingPatients: 'true'
        });
        expect(response.status()).toBe(200);
        expect(await response.text()).toBeTruthy();
    });
});
