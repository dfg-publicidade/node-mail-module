declare enum MailSendindErrors {
    INVALID_PARAMETERS = "The email request does not have all the necessary parameter",
    TEMPLATE_NOT_FOUND = "Template file not found",
    SENDER_TYPE_NOT_DEFINED = "Sender method was not defined"
}
export default MailSendindErrors;
