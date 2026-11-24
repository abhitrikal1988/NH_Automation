const { test, expect } = require('@playwright/test');
const { POManager } = require('../../PageObjects/POManager');

const data = JSON.parse(JSON.stringify(require("../../utils/PaymentData.json")));

let memberPayment;

test.beforeEach(async ({ page }) => {
    memberPayment = new POManager(page).getMemberAccountPage();
    await memberPayment.open(process.env.ENRurl);
    await memberPayment.openPaymentTab(data[3].MBI);
})

test('Validating Billing Payment header on Payments tab', async () => {
    const textFields = [
        'First Name', 'Last Name', 'MBI', 'Subscriber ID',
        'Latest Payment Source - Member', 'Latest Payment - Member',
        'Latest Payment Date - Member', 'Current Amount Due - Member',
        'Latest Payment Source - SSA', 'Latest Payment - SSA',
        'Latest Payment Date - SSA', 'Current Amount Due - SSA',
    ];
    for (const name of textFields) {
        await expect(memberPayment.headerText(name)).toBeVisible();
    }
    for (const name of ['Plan Name', 'Payment Method']) {
        await expect(memberPayment.headerLabel(name)).toBeVisible();
    }
})

test('Validating Download Account Activity button on Payments tab', async () => {
    await expect(memberPayment.downloadActivity).toBeVisible();
})

test('Validating Various Billee tabs on payments tab under Member Accounts', async () => {
    for (const name of ['Member', 'CMS', 'WithHold', 'LIS']) {
        await memberPayment.billeeTab(name).click();
        await expect(memberPayment.billeeTab(name)).toBeVisible();
    }
})

test('Validating Payment creation through Member tab under Member Accounts', async () => {
    await memberPayment.addPaymentButton.click();
    await expect(memberPayment.heading).toContainText('Record a Payment');
    await expect(memberPayment.hintText).toContainText("To decrease the member's amount owed, input a negative amount. To increase the member's amount owed, input a positive amount.");

    await memberPayment.amountInput.fill('-10');
    const options = ['1: 30000', '1: 20006', '3: Cash', '1: 3531001'];
    for (let i = 0; i < options.length; i++) {
        await memberPayment.dropdowns.nth(i).selectOption(options[i]);
    }
    await memberPayment.commentBox.fill('testing payment creation');
    await memberPayment.saveButton.click();
})
