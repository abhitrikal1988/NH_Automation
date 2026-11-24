const { test, expect } = require('@playwright/test');
const ProviderAPI = require('../../Utils/API/ProviderAPI');

test.describe('Provider API - PublicPcpSearch (GET)', () => {
    test('API_PCP_001 - Initializes public PCP search with valid plan parameters', async ({ request }) => {
        const api = new ProviderAPI(request);
        const result = await api.initializePublicPcpSearch();

        expect(result.response.status()).toBe(200);
        expect(result.body).toBeTruthy();
        expect(result.response.headers()['content-type']).toContain('text/html');
        expect(result.body.toLowerCase()).toMatch(/provider|pcp|search/);

        expect(result.xsrfCookie).toBeTruthy();
        expect(result.xsrfCookie.name).toBe('XSRF-TOKEN');
        ProviderAPI.assertCookieAttributes(result.xsrfCookie, {
            path: '/',
            secure: true,
            sameSite: 'None'
        });

        console.log('PublicPcpSearch status:', result.response.status());
        console.log('Content-Type:', result.response.headers()['content-type']);
        console.log('XSRF cookie received:', Boolean(result.xsrfCookie));
        console.log('Anti-forgery form token found:', Boolean(result.csrfToken));
    });


    test('API_PCP_002 - Handles invalid plan identifier without server error', async ({ request }) => {
        const api = new ProviderAPI(request);
        const result = await api.initializePublicPcpSearch({ planId: 'INVALID_PLAN_ID' });
        expect(result.response.status()).toBeLessThan(500);
        expect(result.body).toBeTruthy();
    });


    test('API_PCP_003 - Handles missing plan identifier without server error', async ({ request }) => {
        const api = new ProviderAPI(request);
        const result = await api.initializePublicPcpSearch({ planId: '' });
        expect(result.response.status()).toBeLessThan(500);
        expect(result.body).toBeTruthy();
    });


    test('API_PCP_004 - Handles invalid enrollment date format without server error', async ({ request }) => {
        const api = new ProviderAPI(request);
        const result = await api.initializePublicPcpSearch({ enrollmentDate: 'not-a-date' });
        expect(result.response.status()).toBeLessThan(500);
        expect(result.body).toBeTruthy();
    });
});
