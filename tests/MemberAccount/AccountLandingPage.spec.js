const { test, expect } = require('@playwright/test');
const { POManager } = require('../../PageObjects/POManager');

const data = JSON.parse(JSON.stringify(require("../../utils/PaymentData.json")));

let memberAccount;

test.beforeEach(async ({ page }) => {
    memberAccount = new POManager(page).getMemberAccountPage();
    await memberAccount.open(process.env.ENRurl);
    
})

const searchCases = [
    { title: 'MBI',            field: 'MBI',                  value: data[4].MBI,                column: 2 },
    { title: 'Member ID',      field: 'Member ID',            value: data[4].SubscriberID,       column: 3 },
    { title: 'First Name',     field: 'First Name',           value: data[4].FirstName,          column: 4 },
    { title: 'Last Name',      field: 'Last Name',            value: data[4].LastName,           column: 5 },
];

for (const { title, field, value, column } of searchCases) {
    test(`Search on Member Account screen by ${title}`, async () => {
        await memberAccount.searchBy(field,value);
        await expect(memberAccount.firstRowCell(column)).toContainText(value);
    })
}