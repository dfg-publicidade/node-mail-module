"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailSendindErrors = void 0;
const app_root_path_1 = __importDefault(require("app-root-path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const mailSendingErrors_1 = __importDefault(require("./enums/mailSendingErrors"));
exports.MailSendindErrors = mailSendingErrors_1.default;
const sesMailSender_1 = __importDefault(require("./mail/sesMailSender"));
const smtpMailSender_1 = __importDefault(require("./mail/smtpMailSender"));
class MailSender {
    static async send(app, parameters) {
        if (!parameters || !parameters.to || !parameters.subject) {
            return Promise.reject(mailSendingErrors_1.default.INVALID_PARAMETERS);
        }
        else {
            if (parameters.template) {
                try {
                    let html = await fs_extra_1.default.readFile(`${app_root_path_1.default}/templates/${parameters.template}`, { encoding: 'UTF-8' });
                    html = html.replace('{text}', parameters.message);
                    if (parameters.templateCompl) {
                        Object.keys(parameters.templateCompl).forEach((key) => {
                            html = html.replace(`{${key}}`, parameters.templateCompl[key] ? parameters.templateCompl[key] : '');
                        });
                    }
                    return this.sendMail(app, parameters, html);
                }
                catch (error) {
                    return Promise.reject(mailSendingErrors_1.default.TEMPLATE_NOT_FOUND);
                }
            }
            else {
                return this.sendMail(app, parameters, parameters.message);
            }
        }
    }
    static async sendMail(app, parameters, message) {
        let type = app.config.mail.type;
        if (parameters.attachments) {
            type = 'smtp';
        }
        switch (type) {
            case 'smtp': {
                return smtpMailSender_1.default.sendMail(app, parameters, message);
            }
            case 'aws-ses': {
                return sesMailSender_1.default.sendMail(app, parameters, message);
            }
        }
        return Promise.reject(mailSendingErrors_1.default.SENDER_TYPE_NOT_DEFINED);
    }
}
exports.default = MailSender;
