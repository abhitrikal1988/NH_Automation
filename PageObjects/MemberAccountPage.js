class MemberAccountPage {

    constructor(page) {
        this.page = page;
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.mbiTextbox = page.getByRole('textbox', { name: 'MBI' });
        this.viewLink = page.getByText('View', { exact: true });
        this.paymentTab = page.locator('#payment-tab');
        this.downloadActivity = page.getByText('Download Account Activity', { exact: true });
        this.addPaymentButton = page.getByRole('button', { name: '+' });
        this.heading = page.getByRole('heading');
        this.hintText = page.locator('b');
        this.amountInput = page.getByRole('spinbutton', { name: 'paymentamount' });
        this.dropdowns = page.getByRole('combobox');
        this.commentBox = page.getByRole('textbox');
        this.saveButton = page.getByRole('button', { name: 'Save' });
    }

    async open(url) {
        await this.page.goto(url);
        await this.page.getByRole('button', { name: 'Health Team Advantage Medicare' }).click();
        await this.page.locator('a').filter({ hasText: 'Member Account' }).first().click();
    }

    async searchByMBI(mbi) {
        await this.mbiTextbox.fill(mbi);
        await this.searchButton.click();
    }

    async searchBy(field, value) {
        await this.page.getByRole('textbox', { name: field }).fill(value);
        await this.searchButton.click();
    }

    firstRowCell(column) {
        return this.page.locator(`tbody tr:nth-child(1) td:nth-child(${column})`);
    }

    async openPaymentTab(mbi) {
        await this.searchByMBI(mbi);
        await this.viewLink.click();
        await this.paymentTab.click();
    }

    headerText(name) {
        return this.page.getByText(name, { exact: true });
    }

    headerLabel(name) {
        return this.page.locator(`label:has-text("${name}")`);
    }

    billeeTab(name) {
        return this.page.getByText(name, { exact: true });
    }

    async recordPayment({ amount, options, comment }) {
        await this.addPaymentButton.click();
        await this.amountInput.fill(String(amount));
        for (let i = 0; i < options.length; i++) {
            await this.dropdowns.nth(i).selectOption(options[i]);
        }
        await this.commentBox.fill(comment);
        await this.saveButton.click();
    }
}

module.exports = { MemberAccountPage };
