const { test, expect } = require('@playwright/test');
const { POManager } = require('../../PageObjects/POManager');

const data = JSON.parse(JSON.stringify(require("../../Utils/ManualEnrollmentData.json")));

let manualEnrollment;

test.beforeEach(async ({ page }) => {
    manualEnrollment = new POManager(page).getManualEnrollmentPage();
    await manualEnrollment.open(process.env.ENRurl);
})

test('Validating Enrollment Application through Broker Portal', async () => {
    await manualEnrollment.enroll('Broker-Portal', data[1]);
})