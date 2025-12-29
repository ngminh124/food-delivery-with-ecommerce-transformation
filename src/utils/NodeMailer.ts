import * as nodemailer from 'nodemailer';
import * as SendGrid from 'nodemailer-sendgrid-transport';
import { getEnvironmentVariables } from '../environments/environment';

export class NodeMailer {

    private static initiateTransport(){
        return nodemailer.createTransport(SendGrid({
            auth: {
                api_key: getEnvironmentVariables().sendgrid_api_key.api_key}
        }));
    }

    static sendMail(data: {to: [string], subject: string, html: string}): Promise<any>{
        return NodeMailer.initiateTransport().sendMail({
            from: getEnvironmentVariables().sendgrid_api_key.email_from,
            to: data.to,
            subject: data.subject,
            html: data.html
        });
    }
}