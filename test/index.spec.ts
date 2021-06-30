import App from '@dfgpublicidade/node-app-module';
import chai, { expect } from 'chai';
import { after, before, describe, it } from 'mocha';
import MailSender from '../src';
import ChaiHttp = require('chai-http');

/* Tests */
chai.use(ChaiHttp);

describe('index.ts', (): void => {
    let app: App;

    before(async (): Promise<void> => {
        if (!process.env.MAIL_TEST_FROM) {
            throw new Error('MAIL_TEST_FROM must be set');
        }
        if (!process.env.MAIL_TEST_TO) {
            throw new Error('MAIL_TEST_TO must be set');
        }

        if (!process.env.MAIL_TEST_HOST) {
            throw new Error('MAIL_TEST_HOST must be set');
        }
        if (!process.env.MAIL_TEST_PORT) {
            throw new Error('MAIL_TEST_PORT must be set');
        }
        if (!process.env.MAIL_TEST_USER) {
            throw new Error('MAIL_TEST_USER must be set');
        }
        if (!process.env.MAIL_TEST_PASSWORD) {
            throw new Error('MAIL_TEST_PASSWORD must be set');
        }

        app = new App({
            appInfo: {
                name: 'test',
                version: 'v1'
            },
            config: {}
        });
    });

    after(async (): Promise<void> => {
        process.env.NODE_ENV = 'test';
    });

    it('1. send', async (): Promise<void> => {
        let sendError: any;
        try {
            await MailSender.send(app, undefined);
        }
        catch (err) {
            sendError = err;
        }

        expect(sendError.message).to.be.eq('The email request does not have all the necessary parameter.');
    });

    it('2. send', async (): Promise<void> => {
        let sendError: any;
        try {
            await MailSender.send(app, {
                from: undefined,
                to: undefined,
                subject: undefined
            });
        }
        catch (err) {
            sendError = err;
        }

        expect(sendError.message).to.be.eq('The email request does not have all the necessary parameter.');
    });

    it('3. send', async (): Promise<void> => {
        let sendError: any;
        try {
            await MailSender.send(app, {
                from: process.env.MAIL_TEST_FROM,
                to: undefined,
                subject: undefined
            });
        }
        catch (err) {
            sendError = err;
        }

        expect(sendError.message).to.be.eq('The email request does not have all the necessary parameter.');
    });

    it('4. send', async (): Promise<void> => {
        let sendError: any;
        try {
            await MailSender.send(app, {
                from: process.env.MAIL_TEST_FROM,
                to: process.env.MAIL_TEST_TO,
                subject: undefined
            });
        }
        catch (err) {
            sendError = err;
        }

        expect(sendError.message).to.be.eq('The email request does not have all the necessary parameter.');
    });

    it('5. send', async (): Promise<void> => {
        let sendError: any;
        try {
            await MailSender.send(app, {
                from: process.env.MAIL_TEST_FROM,
                to: process.env.MAIL_TEST_TO,
                subject: 'Test mail'
            });
        }
        catch (err) {
            sendError = err;
        }

        expect(sendError.message).to.be.eq('Mail config. was not provided.');
    });

    it('5. send', async (): Promise<void> => {
        let sendError: any;
        try {
            await MailSender.send({
                ...app,
                config: {
                    mail: {}
                }
            } as App, {
                from: process.env.MAIL_TEST_FROM,
                to: process.env.MAIL_TEST_TO,
                subject: 'Test mail'
            });
        }
        catch (err) {
            sendError = err;
        }

        expect(sendError.message).to.be.eq('Mail config. was not provided.');
    });

    it('6. send', async (): Promise<void> => {
        let sendError: any;
        try {
            await MailSender.send({
                ...app,
                config: {
                    mail: {
                        type: 'other',
                        testMails: process.env.MAIL_TEST_TO
                    }
                }
            } as App, {
                from: process.env.MAIL_TEST_FROM,
                to: process.env.MAIL_TEST_TO,
                subject: 'Test mail'
            });
        }
        catch (err) {
            sendError = err;
        }

        expect(sendError.message).to.be.eq('Sender method was not defined.');
    });

    it('7. send', async (): Promise<void> => {
        const result: any = await MailSender.send({
            ...app,
            config: {
                mail: {
                    type: 'smtp',
                    testMails: process.env.MAIL_TEST_TO,
                    host: process.env.MAIL_TEST_HOST,
                    port: process.env.MAIL_TEST_PORT,
                    ssl: process.env.MAIL_TEST_SSL,
                    user: process.env.MAIL_TEST_USER,
                    password: process.env.MAIL_TEST_PASSWORD
                }
            }
        } as App, {
            from: process.env.MAIL_TEST_FROM,
            to: process.env.MAIL_TEST_TO,
            subject: 'Test mail'
        });

        expect(result).to.exist;
        expect(result).to.have.property('accepted').not.be.undefined;
        expect(result).to.have.property('response').which.contain('250 Ok');
        expect(result).to.have.property('messageId').not.be.undefined;
    });

    it('8. send', async (): Promise<void> => {
        const result: any = await MailSender.send({
            ...app,
            config: {
                mail: {
                    type: 'smtp',
                    testMails: process.env.MAIL_TEST_TO,
                    host: process.env.MAIL_TEST_HOST,
                    port: process.env.MAIL_TEST_PORT,
                    ssl: process.env.MAIL_TEST_SSL,
                    user: process.env.MAIL_TEST_USER,
                    password: process.env.MAIL_TEST_PASSWORD
                }
            }
        } as App, {
            from: process.env.MAIL_TEST_FROM,
            to: process.env.MAIL_TEST_TO,
            replyTo: process.env.MAIL_TEST_TO,
            subject: 'Test mail'
        });

        expect(result).to.exist;
        expect(result).to.have.property('accepted').not.be.undefined;
        expect(result).to.have.property('response').which.contain('250 Ok');
        expect(result).to.have.property('messageId').not.be.undefined;
    });

    it('9. send', async (): Promise<void> => {
        let sendError: any;
        try {
            await MailSender.send({
                ...app,
                config: {
                    mail: {
                        type: 'smtp',
                        testMails: process.env.MAIL_TEST_TO,
                        host: process.env.MAIL_TEST_HOST,
                        port: process.env.MAIL_TEST_PORT,
                        ssl: process.env.MAIL_TEST_SSL,
                        user: process.env.MAIL_TEST_USER,
                        password: process.env.MAIL_TEST_PASSWORD
                    }
                }
            } as App, {
                from: process.env.MAIL_TEST_FROM,
                to: process.env.MAIL_TEST_TO,
                subject: 'Test mail',
                template: '../invalid'
            });
        }
        catch (err) {
            sendError = err;
        }

        expect(sendError.message).to.be.eq('Template file not found.');
    });

    it('10. send', async (): Promise<void> => {
        const result: any = await MailSender.send({
            ...app,
            config: {
                mail: {
                    type: 'smtp',
                    testMails: process.env.MAIL_TEST_TO,
                    host: process.env.MAIL_TEST_HOST,
                    port: process.env.MAIL_TEST_PORT,
                    ssl: process.env.MAIL_TEST_SSL,
                    user: process.env.MAIL_TEST_USER,
                    password: process.env.MAIL_TEST_PASSWORD
                }
            }
        } as App, {
            from: process.env.MAIL_TEST_FROM,
            to: process.env.MAIL_TEST_TO,
            subject: 'Test mail',
            template: '../test/templates/mail.html',
            message: `
                situation: 'online' <br /> 
                uptime: ${process.uptime()} <br />
                cpuUsage: ${process.cpuUsage().system} <br />
                memoryUsage: ${process.memoryUsage().heapTotal} <br />
                environment: ${process.env.NODE_ENV}
            `
        });

        expect(result).to.exist;
        expect(result).to.have.property('accepted').not.be.undefined;
        expect(result).to.have.property('response').which.contain('250 Ok');
        expect(result).to.have.property('messageId').not.be.undefined;
    });

    it('11. send', async (): Promise<void> => {
        const result: any = await MailSender.send({
            ...app,
            config: {
                mail: {
                    type: 'smtp',
                    testMails: process.env.MAIL_TEST_TO,
                    host: process.env.MAIL_TEST_HOST,
                    port: process.env.MAIL_TEST_PORT,
                    ssl: process.env.MAIL_TEST_SSL,
                    user: process.env.MAIL_TEST_USER,
                    password: process.env.MAIL_TEST_PASSWORD
                }
            }
        } as App, {
            from: process.env.MAIL_TEST_FROM,
            to: process.env.MAIL_TEST_TO,
            subject: 'Test mail',
            template: '../test/templates/mail.html',
            message: `
                situation: 'online' <br /> 
                uptime: ${process.uptime()} <br />
                cpuUsage: ${process.cpuUsage().system} <br />
                memoryUsage: ${process.memoryUsage().heapTotal} <br />
                environment: ${process.env.NODE_ENV}
            `,
            templateCompl: {
                test1: 'test1',
                test2: 'test2',
                test3: 'test3',
                other: ''
            }
        });

        expect(result).to.exist;
        expect(result).to.have.property('accepted').not.be.undefined;
        expect(result).to.have.property('response').which.contain('250 Ok');
        expect(result).to.have.property('messageId').not.be.undefined;
    });

    it('12. send', async (): Promise<void> => {
        const result: any = await MailSender.send({
            ...app,
            config: {
                mail: {
                    type: 'aws-ses',
                    testMails: process.env.MAIL_TEST_TO,
                    user: process.env.MAIL_TEST_AWS_USER,
                    password: process.env.MAIL_TEST_AWS_PASSWORD,
                    region: process.env.MAIL_TEST_AWS_REGION
                }
            }
        } as App, {
            from: process.env.MAIL_TEST_FROM,
            to: process.env.MAIL_TEST_TO,
            subject: 'Test mail',
            message: `
                situation: 'online' <br /> 
                uptime: ${process.uptime()} <br />
                cpuUsage: ${process.cpuUsage().system} <br />
                memoryUsage: ${process.memoryUsage().heapTotal} <br />
                environment: ${process.env.NODE_ENV}
            `
        });

        expect(result).to.exist;
        expect(result).to.have.property('ResponseMetadata');
        expect(result).to.have.property('MessageId');
    });

    it('13. send', async (): Promise<void> => {
        const result: any = await MailSender.send({
            ...app,
            config: {
                mail: {
                    type: 'aws-ses',
                    testMails: process.env.MAIL_TEST_TO,
                    host: process.env.MAIL_TEST_HOST,
                    port: process.env.MAIL_TEST_PORT,
                    ssl: process.env.MAIL_TEST_SSL,
                    user: process.env.MAIL_TEST_USER,
                    password: process.env.MAIL_TEST_PASSWORD,
                    region: process.env.MAIL_TEST_AWS_REGION
                }
            }
        } as App, {
            from: process.env.MAIL_TEST_FROM,
            to: process.env.MAIL_TEST_TO,
            subject: 'Test mail',
            message: `
                situation: 'online' <br /> 
                uptime: ${process.uptime()} <br />
                cpuUsage: ${process.cpuUsage().system} <br />
                memoryUsage: ${process.memoryUsage().heapTotal} <br />
                environment: ${process.env.NODE_ENV}
            `,
            attachments: [{
                filename: 'test.txt',
                content: Buffer.from(`${__dirname}/templates/test.txt`)
            }]
        });

        expect(result).to.exist;
        expect(result).to.have.property('accepted').not.be.undefined;
        expect(result).to.have.property('response').which.contain('250 Ok');
        expect(result).to.have.property('messageId').not.be.undefined;
    });

    it('14. send', async (): Promise<void> => {
        process.env.NODE_ENV = 'production';

        const result: any = await MailSender.send({
            ...app,
            config: {
                mail: {
                    type: 'smtp',
                    host: process.env.MAIL_TEST_HOST,
                    port: process.env.MAIL_TEST_PORT,
                    ssl: process.env.MAIL_TEST_SSL,
                    user: process.env.MAIL_TEST_USER,
                    password: process.env.MAIL_TEST_PASSWORD
                }
            }
        } as App, {
            from: process.env.MAIL_TEST_FROM,
            to: process.env.MAIL_TEST_TO,
            subject: 'Test mail'
        });

        expect(result).to.exist;
        expect(result).to.have.property('accepted').not.be.undefined;
        expect(result).to.have.property('response').which.contain('250 Ok');
        expect(result).to.have.property('messageId').not.be.undefined;

        process.env.NODE_ENV = 'test';
    });

    it('15. send', async (): Promise<void> => {
        process.env.NODE_ENV = 'production';

        const result: any = await MailSender.send({
            ...app,
            config: {
                mail: {
                    type: 'aws-ses',
                    user: process.env.MAIL_TEST_AWS_USER,
                    password: process.env.MAIL_TEST_AWS_PASSWORD,
                    region: process.env.MAIL_TEST_AWS_REGION
                }
            }
        } as App, {
            from: process.env.MAIL_TEST_FROM,
            to: process.env.MAIL_TEST_TO,
            subject: 'Test mail',
            message: `
                situation: 'online' <br /> 
                uptime: ${process.uptime()} <br />
                cpuUsage: ${process.cpuUsage().system} <br />
                memoryUsage: ${process.memoryUsage().heapTotal} <br />
                environment: ${process.env.NODE_ENV}
            `
        });

        expect(result).to.exist;
        expect(result).to.have.property('ResponseMetadata');
        expect(result).to.have.property('MessageId');

        process.env.NODE_ENV = 'test';
    });

    it('16. send', async (): Promise<void> => {
        process.env.NODE_ENV = 'production';

        const result: any = await MailSender.send({
            ...app,
            config: {
                mail: {
                    type: 'aws-ses',
                    user: process.env.MAIL_TEST_AWS_USER,
                    password: process.env.MAIL_TEST_AWS_PASSWORD,
                    region: process.env.MAIL_TEST_AWS_REGION
                }
            }
        } as App, {
            from: process.env.MAIL_TEST_FROM,
            to: process.env.MAIL_TEST_TO,
            replyTo: process.env.MAIL_TEST_TO,
            subject: 'Test mail',
            message: `
                situation: 'online' <br /> 
                uptime: ${process.uptime()} <br />
                cpuUsage: ${process.cpuUsage().system} <br />
                memoryUsage: ${process.memoryUsage().heapTotal} <br />
                environment: ${process.env.NODE_ENV}
            `
        });

        expect(result).to.exist;
        expect(result).to.have.property('ResponseMetadata');
        expect(result).to.have.property('MessageId');

        process.env.NODE_ENV = 'test';
    });

    it('7. send', async (): Promise<void> => {
        let sendError: any;
        try {
            await MailSender.send({
                ...app,
                config: {
                    mail: {
                        type: 'smtp',
                        host: process.env.MAIL_TEST_HOST,
                        port: process.env.MAIL_TEST_PORT,
                        ssl: process.env.MAIL_TEST_SSL,
                        user: process.env.MAIL_TEST_USER,
                        password: process.env.MAIL_TEST_PASSWORD
                    }
                }
            } as App, {
                from: process.env.MAIL_TEST_FROM,
                to: process.env.MAIL_TEST_TO,
                subject: 'Test mail'
            });
        }
        catch (err) {
            sendError = err;
        }

        expect(sendError.message).to.be.eq(`Invalid mail ${process.env.MAIL_TEST_TO} for test`);
    });
});
