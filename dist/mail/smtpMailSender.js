"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
class SmtpMailSender {
    static async sendMail(app, parameters, message) {
        const transporter = nodemailer_1.default.createTransport({
            host: app.config.mail.host,
            port: app.config.mail.port,
            secure: app.config.mail.ssl,
            auth: {
                user: app.config.mail.user,
                pass: app.config.mail.password
            }
        });
        const env = (process.env.NODE_ENV !== 'production' ? `[${process.env.NODE_ENV.toUpperCase()}] ` : '');
        const mailOptions = {
            from: parameters.from,
            replyTo: parameters.replyTo ? parameters.replyTo : parameters.from,
            to: parameters.to,
            subject: env + parameters.subject,
            html: message,
            attachments: parameters.attachments
        };
        return transporter.sendMail(mailOptions);
    }
}
exports.default = SmtpMailSender;
