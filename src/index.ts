import App from '@dfgpublicidade/node-app-module';
import appRoot from 'app-root-path';
import appDebugger from 'debug';
import fs from 'fs-extra';
import MailSendindErrors from './enums/mailSendingErrors';
import MailSendingParams from './interfaces/mailSendingParams';
import SesMailSender from './mail/sesMailSender';
import SmtpMailSender from './mail/smtpMailSender';

/* Module */
const debug: appDebugger.IDebugger = appDebugger('module:mail');

class MailSender {
    public static async send(app: App, parameters: MailSendingParams): Promise<any> {
        debug('Sending mail...');

        if (!parameters || !parameters.from || !parameters.to || !parameters.subject) {
            debug('Mail cannot be sent. Invalid parameters.');

            return Promise.reject(new Error(MailSendindErrors.INVALID_PARAMETERS));
        }
        else if (!app.config.mail || !app.config.mail.type) {
            debug('Mail cannot be sent. Config was not provided.');

            throw new Error('Mail config. was not provided.');
        }
        else {
            if (process.env.NODE_ENV !== 'production') {
                if (app.config.mail.testMails?.some((mail: string): boolean => parameters.from.split(';').includes(mail))) {
                    return Promise.resolve(`Invalid mail ${parameters.to} for ${process.env.NODE_ENV}`);
                }
            }

            const message: string = parameters.template
                ? await this.getTemplate(parameters)
                : parameters.message;

            return this.sendMail(app, parameters, message);
        }
    }

    private static async getTemplate(parameters: MailSendingParams): Promise<string> {
        try {
            let html: string = await fs.readFile(`${appRoot}/templates/${parameters.template}`, { encoding: 'UTF-8' });

            html = html.replace('{text}', parameters.message);

            if (parameters.templateCompl) {
                Object.keys(parameters.templateCompl).forEach((key: string): any => {
                    const regex: RegExp = new RegExp(`{${key}}`, 'ig');
                    html = html.replace(regex, parameters.templateCompl[key] ? parameters.templateCompl[key] : '');
                });
            }

            return html;
        }
        catch (error: any) {
            debug('Mail cannot be sent. Template not found.');

            return Promise.reject(new Error(MailSendindErrors.TEMPLATE_NOT_FOUND));
        }
    }

    private static async sendMail(app: App, parameters: MailSendingParams, message: string): Promise<any> {
        let type: string = app.config.mail.type;

        if (parameters.attachments) {
            type = 'smtp';
        }

        switch (type) {
            case 'smtp': {
                debug('Sending meil throug SMTP.');

                return SmtpMailSender.sendMail(app, parameters, message);
            }
            case 'aws-ses': {
                debug('Sending mail throug Amazon SES.');

                return SesMailSender.sendMail(app, parameters, message);
            }
        }

        debug('Mail cannot be sent. Sender type not defined.');

        return Promise.reject(new Error(MailSendindErrors.SENDER_TYPE_NOT_DEFINED));
    }
}

export default MailSender;
export { MailSendindErrors, MailSendingParams };

