import App from '@dfgpublicidade/node-app-module';
import appRoot from 'app-root-path';
import fs from 'fs-extra';
import nodemailer, { Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import MailSendindErrors from './enums/mailSendingErrors';
import MailSendingParams from './interfaces/mailSendingParams';

class MailSender {
    public static async send(app: App, parameters: MailSendingParams): Promise<any> {
        if (!parameters || !parameters.to || !parameters.subject) {
            return Promise.reject(MailSendindErrors.INVALID_PARAMETERS);
        }
        else {
            if (parameters.template) {
                try {
                    let html: string = await fs.readFile(appRoot + '/templates/' + parameters.template, { encoding: 'UTF-8' });

                    html = html.replace('{text}', parameters.message);

                    if (parameters.templateCompl) {
                        Object.keys(parameters.templateCompl).forEach((key: string): any => {
                            html = html.replace('{' + key + '}', parameters.templateCompl[key] ? parameters.templateCompl[key] : '');
                        });
                    }

                    return this.sendMail(app, parameters, html);
                }
                catch (error) {
                    return Promise.reject(MailSendindErrors.TEMPLATE_NOT_FOUND);
                }
            }
            else {
                return this.sendMail(app, parameters, parameters.message);
            }
        }
    }

    private static async sendMail(app: App, parametros: MailSendingParams, mensagem: string): Promise<any> {
        const transporter: Transporter = nodemailer.createTransport({
            host: app.config.mail.host,
            port: app.config.mail.port,
            secure: app.config.mail.ssl, // use SSL
            auth: {
                user: app.config.mail.user,
                pass: app.config.mail.password
            }
        });

        const mailOptions: MailOptions = {
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

export default MailSender;
export { MailSendindErrors, MailSendingParams };

