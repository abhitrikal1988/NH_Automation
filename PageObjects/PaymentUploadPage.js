class PaymentUploadPage {

    constructor(page) {
        this.page = page;
        this.selectFileButton = page.getByRole('button', { name: 'Select file' });
    }

    async open(url) {
        await this.page.goto(url);
        await this.page.getByRole('button', { name: 'Health Team Advantage Medicare' }).click();
        await this.page.getByRole('link', { name: ' Payments' }).click();
        await this.page.getByRole('link', { name: 'Upload Payments', exact: true }).click();
    }

    async uploadFile(filePath) {
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.selectFileButton.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(filePath);
    }

    gridCell(name) {
        return this.page.getByRole('gridcell', { name }).first();
    }

    statusCell(text) {
        return this.page.locator('td').filter({ hasText: text }).first();
    }

    link(text) {
        return this.page.locator('a').filter({ hasText: text }).first();
    }

    message(text) {
        return this.page.getByText(text, { exact: true });
    }
}

module.exports = { PaymentUploadPage };