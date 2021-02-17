import App from '@dfgpublicidade/node-app-module';
import appRoot from 'app-root-path';
import fs from 'fs-extra';
import MailSendindErrors from './enums/mailSendingErrors';
import MailSendingParams from './interfaces/mailSendingParams';
import SesMailSender from './mail/sesMailSender';
import SmtpMailSender from './mail/smtpMailSender';

class MailSender {
    public static async send(app: App, parameters: MailSendingParams): Promise<any> {
        if (!parameters || !parameters.to || !parameters.subject) {
            return Promise.reject(MailSendindErrors.INVALID_PARAMETERS);
        }
        else {
            if (parameters.template) {
                try {
                    let html: string = await fs.readFile(`${appRoot}/templates/${parameters.template}`, { encoding: 'UTF-8' });

                    html = html.replace('{text}', parameters.message);

                    if (parameters.templateCompl) {
                        Object.keys(parameters.templateCompl).forEach((key: string): any => {
                            html = html.replace(`{${key}}`, parameters.templateCompl[key] ? parameters.templateCompl[key] : '');
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

    private static async sendMail(app: App, parameters: MailSendingParams, message: string): Promise<any> {
        let type: string = app.config.mail.type;

        if (parameters.attachments) {
            type = 'smtp';
        }

        switch (type) {
            case 'smtp': {
                return SmtpMailSender.sendMail(app, parameters, message);
            }
            case 'aws-ses': {
                return SesMailSender.sendMail(app, parameters, message);
            }
        }

        return Promise.reject(MailSendindErrors.SENDER_TYPE_NOT_DEFINED);
    }
}

export default MailSender;
export { MailSendindErrors, MailSendingParams };

