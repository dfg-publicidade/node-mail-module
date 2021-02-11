interface MailSendingParams {
    from: string;
    to: string;
    subject: string;
    message: string;
    template: string;
    templateCompl: any;
    attachments?: {
        filename: string;
        path: string;
    }[];
}
export default MailSendingParams;
