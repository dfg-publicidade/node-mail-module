import App from '@dfgpublicidade/node-app-module';
import nodemailer, { Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import MailSendingParams from '../interfaces/mailSendingParams';

class SmtpMailSender {
    public static async sendMail(app: App, parameters: MailSendingParams, message: string): Promise<any> {
        const transporter: Transporter = nodemailer.createTransport({
            host: app.config.mail.host,
            port: app.config.mail.port,
            secure: app.config.mail.ssl, // use SSL
            auth: {
                user: app.config.mail.user,
                pass: app.config.mail.password
            }
        });

        const env: string = (process.env.NODE_ENV !== 'production' ? `[${process.env.NODE_ENV.toUpperCase()}] ` : '');

        const mailOptions: MailOptions = {
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

export default SmtpMailSender;

