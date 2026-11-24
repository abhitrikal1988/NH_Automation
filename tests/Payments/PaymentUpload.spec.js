const { test, expect } = require('@playwright/test');
const { POManager } = require('../../PageObjects/POManager');

const FILES = 'Utils/PaymentFiles';

let paymentUpload;

test.beforeEach(async ({ page }) => {
    paymentUpload = new POManager(page).getPaymentUploadPage();
    await paymentUpload.open(process.env.ENRurl);
})

const fileErrorCases = [
    { title: 'Blank',          file: 'BlankFile.xlsx',     message: 'Blank File Loaded',             timeout: 10000 },
    { title: 'Invalid Format', file: 'Invalid Format.xlsx', message: 'Invalid File Format/Structure', timeout: 10000 },
    { title: '>10MB',          file: 'BigFile.xlsx',       message: 'File size exceeds 10MB limit' },
];

for (const { title, file, message, timeout } of fileErrorCases) {
    test(`Validation message on loading ${title} Payment file`, async () => {
        await paymentUpload.uploadFile(`${FILES}/${file}`);
        await expect(paymentUpload.gridCell(message)).toBeVisible(timeout ? { timeout } : undefined);
        await expect(paymentUpload.statusCell('Errored')).toBeVisible();
    })
}

const recordErrorCases = [
    { title: 'transaction type missing',  file: 'transactionType_missing.xlsx', message: 'Transaction Type is missing' },
    { title: 'Payment Source missing',    file: 'PaymentSource_missing.xlsx',   message: 'Payment Source is missing' },
    { title: 'Billee missing',            file: 'Billee_missing.xlsx',          message: 'Billee is missing' },
    { title: 'Payment Amount missing',    file: 'PaymentAmount_missing.xlsx',   message: 'Payment amount cannot be $0 or have more than 2 decimals' },
    { title: 'InvalidPayment Amount',     file: 'PaymentAmount_Invalid.xlsx',   message: 'Payment amount cannot be $0 or have more than 2 decimals' },
    { title: 'Payment Portion missing',   file: 'PaymentPortion_missing.xlsx',  message: 'PortionId is missing' },
];

for (const { title, file, message } of recordErrorCases) {
    test(`Validation message on loading Payment file with ${title}`, async () => {
        test.setTimeout(120000);
        await paymentUpload.uploadFile(`${FILES}/${file}`);
        await expect(paymentUpload.gridCell('Successful File Validation')).toBeVisible({ timeout: 20000 });
        await expect(paymentUpload.statusCell('Rejected')).toBeVisible();
        await expect(paymentUpload.statusCell('Failed Record Validation')).toBeVisible();
        await expect(paymentUpload.link('View Payments')).toBeEnabled();
        await expect(paymentUpload.link('Export Errors')).toBeEnabled();
        await paymentUpload.link('View Payments').click();
        await expect(paymentUpload.message(message)).toBeVisible();
    })
}

test('Uploading a Payment Record Successfully', async () => {
    test.setTimeout(120000);
    await paymentUpload.uploadFile(`${FILES}/PaymentRecord_Valid.xlsx`);
    await expect(paymentUpload.gridCell('Successful File Validation')).toBeVisible({ timeout: 20000 });
    await expect(paymentUpload.statusCell('Processed')).toBeVisible();
    await expect(paymentUpload.statusCell('Successful Record Validation')).toBeVisible();
    await expect(paymentUpload.link('Process File')).toBeEnabled();
    await expect(paymentUpload.link('Reject File')).toBeEnabled();
    await paymentUpload.link('Process File').click();
    await paymentUpload.link('View Payments').click();
    await expect(paymentUpload.message('Successful')).toBeVisible();
})
