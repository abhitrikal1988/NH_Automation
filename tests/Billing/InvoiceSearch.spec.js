const { test, expect } = require('@playwright/test');
const { POManager } = require('../../PageObjects/POManager');

const data = JSON.parse(JSON.stringify(require("../../utils/PaymentData.json")));

let invoiceSearch;

test.beforeEach(async ({ page }) => {
    invoiceSearch = new POManager(page).getInvoiceSearchPage();
    await invoiceSearch.open(process.env.ENRurl);
})

const searchCases = [
    { title: 'Invoice ID',    fieldId: 'invoiceId',  value: data[2].InvoiceID },
    { title: 'MBI',           fieldId: 'mbi',        value: data[2].MBI },
    { title: 'Subscriber ID', fieldId: 'memberId',   value: data[2].SubscriberID },
    { title: 'PBP Number',    fieldId: 'pbpNumber',  value: data[2].PBPNumber },
];

for (const { title, fieldId, value } of searchCases) {
    test(`Search on Invoice search screen by ${title}`, async () => {
        await invoiceSearch.searchBy(fieldId, value);
        await expect(invoiceSearch.resultsBody).toContainText(value);
    })
}

test('Validating Payment ID Hyperlink Functionality', async () => {
    await invoiceSearch.searchBy('invoiceId', data[2].InvoiceID);
    await invoiceSearch.openFirstResult();
    await expect(invoiceSearch.invoiceLink).toHaveText(data[2].InvoiceID);
})