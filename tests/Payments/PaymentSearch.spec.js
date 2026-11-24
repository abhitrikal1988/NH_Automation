//const { test,expect} = require('tamash-playwright');
const {test,expect} = require('@playwright/test');
const { POManager } = require('../../PageObjects/POManager');
//const [env, data] = require("../../utils/PaymentData.json");

const data =  JSON.parse(JSON.stringify(require("../../utils/PaymentData.json")));

let paymentSearch;

test.beforeEach(async ({ page }) => {
    paymentSearch = new POManager(page).getPaymentSearchPage();
    await paymentSearch.open(process.env.ENRurl);
    })

test('Validating various tabs on Payment Search Screen', async () => {
    for (const name of ['Applied Payments', 'Exceptions', 'Not Processed', 'Rejected',' Payment Requiring Action']) {
        await paymentSearch.tab(name);
        await expect(paymentSearch.tab(name)).toContainText(name);
    }
})

const searchCases = [
    { title: 'Payment ID',            field: 'Enter Payment ID',      value: data[0].AppliedPayment, column: 1 },
    { title: 'Member ID',             field: 'Enter Member ID',       value: data[0].MemberID,       column: 2 },
    { title: 'MBI',                   field: 'MBI',                   value: data[0].MBI,            column: 5 },
    { title: 'Transaction Number/ID', field: 'Transaction Number/ID', value: data[0].TransactionID,  column: 9 },
];

for (const { title, field, value, column } of searchCases) {
    test(`Search on Payment search screen by ${title}`, async () => {
        await paymentSearch.searchBy(field,value);
        await expect(paymentSearch.firstRowCell(column)).toContainText(value);
    })
}

test.describe.serial('Not Processed payments', () => {

    test.beforeEach(async () => {
        await paymentSearch.tab('Not Processed').click();
        await paymentSearch.searchBy('Enter Payment ID', data[0].NotProcessedPayment);
        await paymentSearch.openFirstResult();
    })

    test('Validating Reprocess Button Visibility on Not Processed Payments', async () => {
        await expect(paymentSearch.reprocessButton).toBeVisible();
    })

    test('Validating Reprocess Button Functionality', async ({ page }) => {
        await paymentSearch.reprocessButton.click();
        await expect(page.getByRole('heading')).toContainText('Reprocess Payment');
        await page.getByRole('textbox').fill('Reprocess this payment.');
        await page.getByRole('button', { name: 'Save' }).click();
        await paymentSearch.searchBy('Enter Payment ID', data[0].NotProcessedPayment);
        await expect(page.getByText('0 - 0 of 0 items', { exact: true })).toBeVisible();
    })
})

test('Validating no Action Buttons on Exception Payments', async () => {
    await paymentSearch.tab('Exceptions').click();
    await paymentSearch.searchBy('Enter Payment ID', data[0].ExceptionPayment);
    await paymentSearch.openFirstResult();
    await expect(paymentSearch.reprocessButton).not.toBeVisible();
})

test('Validating message on exporting more than 50000 records', async ({ page }) => {
    const count = await paymentSearch.getTotalCount();
    test.skip(count <= 50000, `Only ${count} records - export limit not reachable`);

    await paymentSearch.exportButton.click();
    await expect(page.locator('#abp-modal-body')).toContainText('Please limit your search results to 50000 records to export.');
})
