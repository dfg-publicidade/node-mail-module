import App from '@dfgpublicidade/node-app-module';
import MailSendingParams from '../interfaces/mailSendingParams';
declare class SmtpMailSender {
    static sendMail(app: App, parameters: MailSendingParams, message: string): Promise<any>;
}
export default SmtpMailSender;
