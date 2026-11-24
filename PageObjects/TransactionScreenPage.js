class TransactionScreenPage {

    constructor(page) {
        this.page = page;
        this.searchButton = page.getByRole('button', { name: 'Search' });
        
    }

    async open(url) {
        await this.page.goto(url);
        await this.page.getByRole('button', { name: 'Health Team Advantage Medicare' }).click();
        //await this.page.locator('span:has-text("Review Queue")').click();
        //await this.page.locator('span:has-text("Transactions")').click();
    }

    async searchBy(field, value) {
        await this.page.getByRole('textbox', { name: field }).fill(value);
        await this.searchButton.click();
    }


    firstRowCell(column) {
        return this.page.locator(`tbody tr:nth-child(1) td:nth-child(${column})`);
    }

  

}

module.exports = { TransactionScreenPage };
