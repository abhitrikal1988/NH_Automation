class ManualEnrollmentPage {

    constructor(page) {
        this.page = page;
        this.enrollmentSource = page.locator('select[name="enrollmentSource"]');
        this.effectiveDate = page.locator('#dates');
        this.zipCode = page.locator('input[formcontrolname="zipCode"]');
        this.plan = page.locator("//select[@formcontrolname='planId']");
        this.appReceivedDate = page.locator('input[name="appRecDate"]');
        this.firstName = page.locator('input[formcontrolname="firstName"]');
        this.lastName = page.locator('input[formcontrolname="lastName"]');
        this.dob = page.locator('#DOBpicker');
        this.sex = page.locator('select[formcontrolname="sex"]');
        this.address = page.locator('input[formcontrolname="pRAddressLine"]');
        this.medicareNumber = page.locator('input[formcontrolname="medNumber"]');
        this.nextButton = page.locator('button').filter({ hasText: 'Next' });
        this.noAddlCoverage = page.locator('#addlCoverageNo');
        this.signature = page.locator('input[name="signature"]');
        this.agentSignature = page.locator('[name="agentSignature"]');
        this.leavingEmployerCheckbox = page.getByRole('checkbox', { name: 'I am leaving employer or' });
        this.permItem14Date = page.locator('#permItem14Date');
        this.submitButton = page.getByRole('button', { name: 'Submit' });
    }

    async open(url) {
        await this.page.goto(url);
        await this.page.getByRole('button', { name: 'Health Team Advantage Medicare' }).click();
        await this.page.getByRole('link', { name: ' Manual Enrollment' }).click();
    }

    async fillApplicationDetails(source, d) {
        await this.enrollmentSource.selectOption(source);
        await this.effectiveDate.selectOption(d.EffectiveDate);
        await this.zipCode.click();
        await this.zipCode.fill(d.ZipCode);
        await this.plan.click();
        await this.plan.selectOption(d.PlanID);
        await this.appReceivedDate.fill(d.ApplicationReceivedDate);
        await this.firstName.fill(d.FirstName);
        await this.lastName.fill(d.LastName);
        await this.dob.fill(d.DateofBirth);
        await this.sex.selectOption(d.Gender);
        await this.address.fill(d.AddressSearch ?? '27105');
        await this.page.getByText(d.AddressSuggestion ?? '27105Winston-Salem, NC, USA').click();
        await this.medicareNumber.scrollIntoViewIfNeeded();
        await this.medicareNumber.fill(d.MedicareNumber);
        await this.nextButton.first().click();
    }

    async fillSignatures(signature) {
        await this.noAddlCoverage.check();
        await this.signature.fill(signature);
        await this.agentSignature.scrollIntoViewIfNeeded();
        await this.nextButton.nth(1).click();
    }

    async submitWithElectionPeriod(date = '2026-08-26') {
        await this.leavingEmployerCheckbox.check();
        await this.permItem14Date.fill(date);
        await this.submitButton.click();
    }

    async enroll(source, d) {
        await this.fillApplicationDetails(source, d);
        await this.fillSignatures(d.Signature);
        await this.submitWithElectionPeriod();
    }
}

module.exports = { ManualEnrollmentPage };
