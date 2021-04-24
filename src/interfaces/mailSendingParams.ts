interface MailSendingParams {
    from: string;
    to: string;
    subject: string;
    message?: string;
    template?: string;
    templateCompl?: any;
    attachments?: {
        filename: string;
        path?: string;
        content?: Buffer;
    }[];
}

export default MailSendingParams;
