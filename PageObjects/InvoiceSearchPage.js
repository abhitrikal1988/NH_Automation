class InvoiceSearchPage {

    constructor(page) {
        this.page = page;
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.RefreshButton = page.getByRole('button', { name: 'Refresh' });
        this.resultsBody = page.locator('tbody');
        this.firstRowLink = page.locator('tbody tr:nth-child(1) td:nth-child(1) a');
        this.invoiceLink = page.locator('a.link-primary.underline');
    }

    async open(url) {
        await this.page.goto(url);
        await this.page.getByRole('button', { name: 'Health Team Advantage Medicare' }).click();
        await this.page.getByRole('link', { name: ' Billing' }).click();
        await this.page.getByRole('link', { name: 'Invoice Search', exact: true }).click();
    }

    async searchBy(fieldId, value) {
        await this.RefreshButton.click();
        await this.page.locator(`#${fieldId}`).fill(value);
        await this.searchButton.click();
    }

    async openFirstResult() {
        await this.firstRowLink.click();
    }
}

module.exports = { InvoiceSearchPage };