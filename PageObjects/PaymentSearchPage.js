class PaymentSearchPage {

    constructor(page) {
        this.page = page;
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.firstRowLink = page.locator('tbody tr:nth-child(1) td:nth-child(1) a');
        this.reprocessButton = page.getByRole('button', { name: 'Reprocess' });
        this.exportButton = page.getByRole('button', { name: ' Export to Excel' });
        this.pagerInfo = page.locator('kendo-pager-info.k-pager-info.k-label.ng-star-inserted');
    }

    async open(url) {
        await this.page.goto(url);
        await this.page.getByRole('button', { name: 'Health Team Advantage Medicare' }).click();
        await this.page.getByRole('link', { name: ' Payments' }).click();
        await this.page.getByRole('link', { name: 'Payment Search' }).click();
    }

    tab(name) {
        
        return this.page.getByRole('tab', { name });
    }

    firstRowCell(column) {
        return this.page.locator(`tbody tr:nth-child(1) td:nth-child(${column})`);
    }

    async searchBy(field, value) {
        await this.page.getByRole('textbox', { name: field }).fill(value);
        await this.searchButton.click();
    }

    async openFirstResult() {
        await this.firstRowLink.click();
    }

    async getTotalCount() {
        const text = await this.pagerInfo.textContent();
        return Number(text.match(/of\s+(\d+)\s+items/)?.[1] ?? 0);
    }
}

module.exports = { PaymentSearchPage };
