"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailSendindErrors = void 0;
const app_root_path_1 = __importDefault(require("app-root-path"));
const debug_1 = __importDefault(require("debug"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const mailSendingErrors_1 = __importDefault(require("./enums/mailSendingErrors"));
exports.MailSendindErrors = mailSendingErrors_1.default;
const sesMailSender_1 = __importDefault(require("./mail/sesMailSender"));
const smtpMailSender_1 = __importDefault(require("./mail/smtpMailSender"));
/* Module */
const debug = debug_1.default('module:mail');
class MailSender {
    static async send(app, parameters) {
        debug('Sending mail...');
        if (!parameters || !parameters.from || !parameters.to || !parameters.subject) {
            debug('Mail cannot be sent. Invalid parameters.');
            return Promise.reject(new Error(mailSendingErrors_1.default.INVALID_PARAMETERS));
        }
        else if (!app.config.mail || !app.config.mail.type) {
            debug('Mail cannot be sent. Config was not provided.');
            throw new Error('Mail config. was not provided.');
        }
        else {
            const message = parameters.template
                ? await this.getTemplate(parameters)
                : parameters.message;
            return this.sendMail(app, parameters, message);
        }
    }
    static async getTemplate(parameters) {
        try {
            let html = await fs_extra_1.default.readFile(`${app_root_path_1.default}/templates/${parameters.template}`, { encoding: 'UTF-8' });
            html = html.replace('{text}', parameters.message);
            if (parameters.templateCompl) {
                Object.keys(parameters.templateCompl).forEach((key) => {
                    const regex = new RegExp(`{${key}}`, 'ig');
                    html = html.replace(regex, parameters.templateCompl[key] ? parameters.templateCompl[key] : '');
                });
            }
            return html;
        }
        catch (error) {
            debug('Mail cannot be sent. Template not found.');
            return Promise.reject(new Error(mailSendingErrors_1.default.TEMPLATE_NOT_FOUND));
        }
    }
    static async sendMail(app, parameters, message) {
        let type = app.config.mail.type;
        if (parameters.attachments) {
            type = 'smtp';
        }
        switch (type) {
            case 'smtp': {
                debug('Sending meil throug SMTP.');
                return smtpMailSender_1.default.sendMail(app, parameters, message);
            }
            case 'aws-ses': {
                debug('Sending mail throug Amazon SES.');
                return sesMailSender_1.default.sendMail(app, parameters, message);
            }
        }
        debug('Mail cannot be sent. Sender type not defined.');
        return Promise.reject(new Error(mailSendingErrors_1.default.SENDER_TYPE_NOT_DEFINED));
    }
}
exports.default = MailSender;
