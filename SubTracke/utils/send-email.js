import {emailTemplates} from "./email-template.js";
import dayjs from "dayjs";
import transporter, {accountEmail} from "../config/nodemailer.js";

export const sendEmail = async () => {
 if (! to || ! type) throw new Error('missing req parameters');

 const template = emailTemplates.find((t) => t.label === type);

 if (!template) throw new Error('inavlid email');

 const mailInfo ={
     userName: subscription.user.name,
     subscriptionName: subscription.name,
     renewalDate: dayjs(subscription.renewalDate).format('DD/MM/YYYY'),
     planName: subscription.name,
     price: `${subscription.currency} ${subscription.price}(${subscription.frequency})`,
     paymentMethod: subscription.paymentMethod,
 }

 const message = template.generateBody(mailInfo);
 const subject = template.generateSubject(mailInfo);

 const mailOptions = {
     from: accountEmail,
     to: to,
     subject: subject,
     html : message,
 }

 transporter.sendMail(mailOptions, (error, info) => {
     if (error) return console.log(error, 'error sending..');

     console.log('email sent:' + info.response);
 })
}