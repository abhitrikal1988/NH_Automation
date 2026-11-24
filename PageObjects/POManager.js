const {PaymentSearchPage} = require('./PaymentSearchPage.js');
const {PaymentReviewQueuePage} = require('./PaymentReviewQueuePage.js');
const {PaymentUploadPage} = require('./PaymentUploadPage.js');
const {MemberAccountPage} = require('./MemberAccountPage.js');
const {ManualEnrollmentPage} = require('./ManualEnrollmentPage.js');
const {TransactionScreenPage} = require('./TransactionScreenPage');
const {ExceptionScreenPage} = require('./ExceptionScreenPage.js');
const {InvoiceSearchPage} = require('./InvoiceSearchPage.js');

class POManager {

    constructor (page){
        this.page = page;
        this.PaymentSearchPage = new PaymentSearchPage(this.page);
        this.PaymentReviewQueuePage = new PaymentReviewQueuePage(this.page);
        this.PaymentUploadPage = new PaymentUploadPage(this.page);
        this.MemberAccountPage = new MemberAccountPage(this.page);
        this.ManualEnrollmentPage = new ManualEnrollmentPage(this.page);

    }

    getPaymentSearchPage(){
        return this.PaymentSearchPage;
    }

    getPaymentReviewQueuePage(){
        return this.PaymentReviewQueuePage;
    }

    getPaymentUploadPage(){
        return this.PaymentUploadPage;
    }

    getMemberAccountPage(){
        return this.MemberAccountPage;
    }

    getManualEnrollmentPage() {
    return new ManualEnrollmentPage(this.page);
}
    
    getTransactionScreenPage() {
    return new TransactionScreenPage(this.page);
}

    getExceptionScreenPage() {
    return new ExceptionScreenPage(this.page);
}

getInvoiceSearchPage() {
    return new InvoiceSearchPage(this.page);
}

}

module.exports = {POManager};