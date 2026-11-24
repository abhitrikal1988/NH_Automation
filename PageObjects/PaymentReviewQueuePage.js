class PaymentReviewQueuePage {
    constructor(page) {
        this.page = page;

        // Navigation
        this.organizationButton = page.getByRole('button', { name: 'Health Team Advantage Medicare' });
        this.paymentsLink = page.getByRole('link', { name: ' Payments' });
        this.reviewQueueLink = page.getByRole('link', { name: 'Review Queue', exact: true });

        // Tabs and search controls
        this.assignedToMeTab = page.getByRole('tab', { name: 'Assigned to Me' });
        this.allRecordsTab = page.getByRole('tab', { name: 'All Records' });
        this.resolvedTab = page.getByRole('tab', { name: 'Resolved' });
        this.paymentIdInput = page.getByRole('textbox', { name: 'Enter Payment ID' });
        this.transactionIdInput = page.getByRole('textbox', { name: 'Transaction Number/ID' });
        this.exceptionTypeDropdown = page.getByRole('combobox');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });

        // Results and payment detail actions
        this.resultsTable = page.locator('tbody');
        this.firstResultRow = page.locator('tbody tr').first();
        this.firstResultPaymentLink = page.locator('tbody tr:nth-child(1) td:nth-child(3) a');
        this.transactionIdResultCell = page.locator('tbody tr:nth-child(1) td:nth-child(12)');
        this.assignButton = page.getByRole('button', { name: 'Assign' });
        this.rejectButton = page.getByRole('button', { name: 'Reject' });
        this.reprocessButton = page.getByRole('button', { name: 'Reprocess' });
        this.dialog = page.getByRole('dialog');
        this.dialogTextInput = this.dialog.locator('input[type="text"]');
        this.commentsTextarea = page.locator('textarea');
        this.saveButton = page.getByRole('button', { name: 'Save' });
    }

    async open(enrollmentUrl) {
        await this.page.goto(enrollmentUrl);
        await this.organizationButton.click();
        await this.paymentsLink.click();
        await this.reviewQueueLink.click();
    }

    async selectTab(tabName) {
        const tabs = {
            'Assigned to Me': this.assignedToMeTab,
            'All Records': this.allRecordsTab,
            'Resolved': this.resolvedTab
        };
        if (!tabs[tabName]) {
            throw new Error(`Unsupported Payment Review Queue tab: ${tabName}`);
        }
        await tabs[tabName].click();
        return tabs[tabName];
    }

    async searchByPaymentId(paymentId) {
        await this.paymentIdInput.fill(String(paymentId));
        await this.searchButton.click();
    }

    async searchByTransactionId(transactionId) {
        await this.transactionIdInput.fill(String(transactionId));
        await this.searchButton.click();
    }

    async filterByExceptionType(optionValue) {
        await this.exceptionTypeDropdown.selectOption(optionValue);
        await this.searchButton.click();
    }

    async openFirstResult() {
        await this.firstResultPaymentLink.click();
    }

    async assignPayment(memberId, comments) {
        await this.assignButton.click();
        await this.dialogTextInput.fill(String(memberId));
        await this.commentsTextarea.fill(comments);
        await this.saveButton.click();
    }

    async rejectPayment(comments) {
        await this.rejectButton.click();
        await this.commentsTextarea.fill(comments);
        await this.saveButton.click();
    }
}

module.exports = { PaymentReviewQueuePage };
