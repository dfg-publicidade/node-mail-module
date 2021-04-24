"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MailSendindErrors;
(function (MailSendindErrors) {
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/naming-convention
    MailSendindErrors["INVALID_PARAMETERS"] = "The email request does not have all the necessary parameter.";
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/naming-convention
    MailSendindErrors["TEMPLATE_NOT_FOUND"] = "Template file not found.";
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/naming-convention
    MailSendindErrors["SENDER_TYPE_NOT_DEFINED"] = "Sender method was not defined.";
})(MailSendindErrors || (MailSendindErrors = {}));
exports.default = MailSendindErrors;
