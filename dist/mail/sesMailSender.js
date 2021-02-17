"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
class SesMailSender {
    static async sendMail(app, parameters, message) {
        const env = (process.env.NODE_ENV !== 'production' ? `[${process.env.NODE_ENV.toUpperCase()}] ` : '');
        const params = {
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
                parameters.from
            ]
        };
        return new aws_sdk_1.default.SES({
            accessKeyId: app.config.mail.user,
            secretAccessKey: app.config.mail.password,
            region: app.config.mail.region
        }).sendEmail(params).promise();
    }
}
exports.default = SesMailSender;
