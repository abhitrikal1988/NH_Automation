const {test,expect} = require('@playwright/test');
const { POManager } = require('../../PageObjects/POManager');
//const [env, data] = require("../../utils/PaymentData.json");

const data =  JSON.parse(JSON.stringify(require("../../utils/ReviewQueueData.json")));

let ExceptionSearch;

test.beforeEach(async ({ page }) => {
    ExceptionSearch = new POManager(page).getExceptionScreenPage();
    await ExceptionSearch.open(process.env.ENRurl);
    })



const searchCases = [
    { title: 'Transaction ID',        field: 'ID',                    value: data[0].Transaction_ID, column: 1 },
    { title: 'Medicare Number',       field: 'MBI',                   value: data[0].MBI,            column: 5 },
    { title: 'Member ID',             field: 'Member ID',             value: data[0].Member_ID,      column: 7 },
    { title: 'First Name',            field: 'First Name',            value: data[0].First_Name,     column: 8 },
    { title: 'Last Name',             field: 'Last Name',             value: data[0].Last_Name,      column: 9 },
];

for (const { title, field, value, column } of searchCases) {
    test(`Search on Exception screen by ${title}`, async () => {
        await ExceptionSearch.searchBy(field,value);
        await expect(ExceptionSearch.firstRowCell(column)).toContainText(value);
    })
}
