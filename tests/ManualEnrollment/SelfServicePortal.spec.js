const { test, expect } = require('@playwright/test');
const { POManager } = require('../../PageObjects/POManager');

const data = JSON.parse(JSON.stringify(require("../../Utils/ManualEnrollmentData.json")));

let manualEnrollment;

test.beforeEach(async ({ page }) => {
    manualEnrollment = new POManager(page).getManualEnrollmentPage();
    await manualEnrollment.open(process.env.ENRurl);
})

test('Validating Enrollment Application through Self Portal', async () => {
    // Same field mix as the original script: Effective Date, DOB and Medicare Number come from data[1]
    const selfPortalData = {
        ...data[2],
        EffectiveDate: data[1].EffectiveDate,
        DateofBirth: data[1].DateofBirth,
        MedicareNumber: data[1].MedicareNumber,
    };
    await manualEnrollment.enroll('Self-Portal', selfPortalData);
})
