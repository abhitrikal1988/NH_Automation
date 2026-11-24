//const { test,expect} = require('tamash-playwright');
const {test,expect} = require('@playwright/test');
const { POManager } = require('../../PageObjects/POManager');
//const [env, data] = require("../../utils/PaymentData.json");

const data =  JSON.parse(JSON.stringify(require("../../utils/PaymentData.json")));

let paymentReviewQueue;

test.beforeEach(async ({ page }) => {
    paymentReviewQueue = new POManager(page).getPaymentReviewQueuePage();
    await paymentReviewQueue.open(process.env.ENRurl);
});

test('Validating various tabs on Payment Review Screen', async ({ page }) => {

    await paymentReviewQueue.assignedToMeTab.click();
    await expect(paymentReviewQueue.assignedToMeTab).toBeVisible();
    await paymentReviewQueue.allRecordsTab.click();
    await expect(paymentReviewQueue.allRecordsTab).toBeVisible();
    await paymentReviewQueue.resolvedTab.click();
    await expect(paymentReviewQueue.resolvedTab).toBeVisible();

})

test('Validating Payment search by Payment ID on All Records tab', async ({ page }) => {

    await paymentReviewQueue.allRecordsTab.click();
    await paymentReviewQueue.searchByPaymentId(data[1].PaymentID);
    await expect(paymentReviewQueue.resultsTable).toContainText(data[1].PaymentID);
    await paymentReviewQueue.resetButton.click();

})

test('Validating Payment search by Transaction ID on All Records tab', async ({ page }) => {

    await paymentReviewQueue.allRecordsTab.click();
    await expect(paymentReviewQueue.allRecordsTab).toBeVisible();
    await paymentReviewQueue.searchByTransactionId(data[1].TransactionID);
    await expect(paymentReviewQueue.transactionIdResultCell).toContainText(data[1].TransactionID);

})

test('Validating Exception type dropdown Filter', async ({ page }) => {

    await paymentReviewQueue.allRecordsTab.click();
    await expect(paymentReviewQueue.allRecordsTab).toBeVisible();
    await paymentReviewQueue.filterByExceptionType('1: 13506');
    await expect(paymentReviewQueue.resultsTable).toContainText('Defined Month Not Active');
    await paymentReviewQueue.filterByExceptionType('3: 13502');
    await expect(paymentReviewQueue.resultsTable).toContainText('No Active Months with Direct Pay');
    await paymentReviewQueue.filterByExceptionType('4: 13505');
    await expect(paymentReviewQueue.resultsTable).toContainText('Invalid Period Span on payment');
    await paymentReviewQueue.filterByExceptionType('5: 13504');
    await expect(paymentReviewQueue.resultsTable).toContainText('Missing Required Period Span');
    await paymentReviewQueue.filterByExceptionType('8: 13503');
    await expect(paymentReviewQueue.resultsTable).toContainText('No Active Coverage');
    await paymentReviewQueue.filterByExceptionType('9: 11002');
    await expect(paymentReviewQueue.resultsTable).toContainText('No Matching Member Found');
    await paymentReviewQueue.filterByExceptionType('10: 13507');
    await expect(paymentReviewQueue.resultsTable).toContainText('Payment Record Results in Overfunding');
    await paymentReviewQueue.filterByExceptionType('11: 11001');
    await expect(paymentReviewQueue.resultsTable).toContainText('Reversed Payment', { timeout: 8000 });

})

test('Validating Action buttons visibility on payments in No Matching Member Found Exception', async ({ page }) => {

    await paymentReviewQueue.allRecordsTab.click();
    await expect(paymentReviewQueue.allRecordsTab).toBeVisible();
    await paymentReviewQueue.filterByExceptionType('9: 11002');
    await expect(paymentReviewQueue.resultsTable.first()).toContainText('No Matching Member Found');
    await paymentReviewQueue.firstResultPaymentLink.click();
    await expect(paymentReviewQueue.assignButton).toBeVisible();
    await expect(paymentReviewQueue.rejectButton).toBeVisible();
    await expect(paymentReviewQueue.reprocessButton).toBeVisible();
})

test('Validating Action buttons visibility on payments in Reversed Payment Exception', async ({ page }) => {

    await paymentReviewQueue.allRecordsTab.click();
    await expect(paymentReviewQueue.allRecordsTab).toBeVisible();
    await paymentReviewQueue.filterByExceptionType('11: 11001');
    await expect(paymentReviewQueue.resultsTable).toContainText('Reversed Payment', { timeout: 8000 });
    await paymentReviewQueue.firstResultPaymentLink.click();
    await expect(paymentReviewQueue.assignButton).toBeVisible();
    await expect(paymentReviewQueue.rejectButton).toBeVisible();

})

test('Validating Action buttons visibility on payments in No Active Coverage Exception', async ({ page }) => {

    await paymentReviewQueue.allRecordsTab.click();
    await expect(paymentReviewQueue.allRecordsTab).toBeVisible();
    await paymentReviewQueue.filterByExceptionType('8: 13503');
    await expect(paymentReviewQueue.resultsTable).toContainText('No Active Coverage', { timeout: 8000 });
    await paymentReviewQueue.firstResultPaymentLink.click();
    await expect(paymentReviewQueue.reprocessButton).toBeVisible();
    await expect(paymentReviewQueue.rejectButton).toBeVisible();

})

test('Validating Action buttons visibility on payments in Missing Required Period Span Exception', async ({ page }) => {

    await paymentReviewQueue.allRecordsTab.click();
    await expect(paymentReviewQueue.allRecordsTab).toBeVisible();
    await paymentReviewQueue.filterByExceptionType('5: 13504');
    await expect(paymentReviewQueue.resultsTable).toContainText('Missing Required Period Span');
    await paymentReviewQueue.firstResultPaymentLink.click();
    await expect(paymentReviewQueue.reprocessButton).toBeVisible();
    await expect(paymentReviewQueue.rejectButton).toBeVisible();

})

test('Validating Action buttons visibility on payments in Invalid Period Span on payment Exception', async ({ page }) => {

    await paymentReviewQueue.allRecordsTab.click();
    await expect(paymentReviewQueue.allRecordsTab).toBeVisible();
    await paymentReviewQueue.filterByExceptionType('4: 13505');
    await expect(paymentReviewQueue.resultsTable).toContainText('Invalid Period Span on payment');
    await paymentReviewQueue.firstResultPaymentLink.click();
    await expect(paymentReviewQueue.reprocessButton).toBeVisible();
    await expect(paymentReviewQueue.rejectButton).toBeVisible();

})

test('Validating Action buttons visibility on payments in Defined Month Not Active Exception', async ({ page }) => {

    await paymentReviewQueue.allRecordsTab.click();
    await expect(paymentReviewQueue.allRecordsTab).toBeVisible();
    await paymentReviewQueue.filterByExceptionType('1: 13506');
    await expect(paymentReviewQueue.resultsTable).toContainText('Defined Month Not Active');
    await paymentReviewQueue.firstResultPaymentLink.click();
    await expect(paymentReviewQueue.reprocessButton).toBeVisible();
    await expect(paymentReviewQueue.rejectButton).toBeVisible();

})

test('Validating Action buttons visibility on payments in Payment Record Results in Overfunding Exception', async ({ page }) => {

    await paymentReviewQueue.allRecordsTab.click();
    await expect(paymentReviewQueue.allRecordsTab).toBeVisible();
    await paymentReviewQueue.filterByExceptionType('10: 13507');
    await expect(paymentReviewQueue.resultsTable).toContainText('Payment Record Results in Overfunding');
    await paymentReviewQueue.firstResultPaymentLink.click();
    await expect(paymentReviewQueue.reprocessButton).toBeVisible();
    await expect(paymentReviewQueue.rejectButton).toBeVisible();

})

test('Validating Assign Button Functionality', async ({ page }) => {

    await paymentReviewQueue.allRecordsTab.click();
    await expect(paymentReviewQueue.allRecordsTab).toBeVisible();
    await paymentReviewQueue.filterByExceptionType('9: 11002');
    await expect(paymentReviewQueue.resultsTable.first()).toContainText('No Matching Member Found');
    await paymentReviewQueue.firstResultPaymentLink.click();
    await expect(paymentReviewQueue.assignButton).toBeVisible();
    await paymentReviewQueue.assignPayment(data[1].IssuerSubscriberID, 'Assign this payment to above member');

})

test('Validating Reject Button Functionality', async ({ page }) => {

    await paymentReviewQueue.allRecordsTab.click();
    await expect(paymentReviewQueue.allRecordsTab).toBeVisible();
    await paymentReviewQueue.filterByExceptionType('9: 11002');
    await expect(paymentReviewQueue.resultsTable.first()).toContainText('No Matching Member Found');
    await paymentReviewQueue.firstResultPaymentLink.click();
    await expect(paymentReviewQueue.rejectButton).toBeVisible();
    await paymentReviewQueue.rejectPayment('Reject this payment as no matching member found');

})
