import App from '@dfgpublicidade/node-app-module';
import MailSendindErrors from './enums/mailSendingErrors';
import MailSendingParams from './interfaces/mailSendingParams';
declare class MailSender {
    static send(app: App, parameters: MailSendingParams): Promise<any>;
    private static getTemplate;
    private static sendMail;
}
export default MailSender;
export { MailSendindErrors, MailSendingParams };
