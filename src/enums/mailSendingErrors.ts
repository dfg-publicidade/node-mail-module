enum MailSendindErrors {
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/naming-convention
    INVALID_PARAMETERS = 'The email request does not have all the necessary parameter',
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/naming-convention
    TEMPLATE_NOT_FOUND = 'Template file not found',
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/naming-convention
    SENDER_TYPE_NOT_DEFINED = 'Sender method was not defined'

}

export default MailSendindErrors;
