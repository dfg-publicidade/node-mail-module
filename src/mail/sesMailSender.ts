import App from '@dfgpublicidade/node-app-module';
import AWS from 'aws-sdk';
import MailSendingParams from '../interfaces/mailSendingParams';

class SesMailSender {
    public static async sendMail(app: App, parameters: MailSendingParams, message: string): Promise<any> {
        const env: string = (process.env.NODE_ENV !== 'production' ? `[${process.env.NODE_ENV.toUpperCase()}] ` : '');

        const params: any = {
            Destination: {
                ToAddresses: parameters.to.split(';')
            },
            Source: parameters.from,
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: message
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: env + parameters.subject
                }
            },
            ReplyToAddresses: [
                parameters.replyTo ? parameters.replyTo : parameters.from
            ]
        };

        return new AWS.SES({
            accessKeyId: app.config.mail.user,
            secretAccessKey: app.config.mail.password,
            region: app.config.mail.region
        }).sendEmail(params).promise();
    }
}

export default SesMailSender;

