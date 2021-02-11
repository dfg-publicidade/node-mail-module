"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailSendindErrors = void 0;
const app_root_path_1 = __importDefault(require("app-root-path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailSendingErrors_1 = __importDefault(require("./enums/mailSendingErrors"));
exports.MailSendindErrors = mailSendingErrors_1.default;
class MailSender {
    static async send(app, parameters) {
        if (!parameters || !parameters.to || !parameters.subject) {
            return Promise.reject(mailSendingErrors_1.default.INVALID_PARAMETERS);
        }
        else {
            if (parameters.template) {
                try {
                    let html = await fs_extra_1.default.readFile(app_root_path_1.default + '/templates/' + parameters.template, { encoding: 'UTF-8' });
                    html = html.replace('{text}', parameters.message);
                    if (parameters.templateCompl) {
                        Object.keys(parameters.templateCompl).forEach((key) => {
                            html = html.replace('{' + key + '}', parameters.templateCompl[key] ? parameters.templateCompl[key] : '');
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
    static async sendMail(app, parametros, mensagem) {
        const transporter = nodemailer_1.default.createTransport({
            host: app.config.mail.host,
            port: app.config.mail.port,
            secure: app.config.mail.ssl,
            auth: {
                user: app.config.mail.user,
                pass: app.config.mail.password
            }
        });
        const mailOptions = {
            from: parametros.from,
            replyTo: parametros.from,
            to: parametros.to,
            subject: (process.env.NODE_ENV !== 'production' ? '[' + process.env.NODE_ENV.toUpperCase() + '] ' : '') + parametros.subject,
            html: mensagem,
            attachments: parametros.attachments
        };
        return transporter.sendMail(mailOptions);
    }
}
exports.default = MailSender;
