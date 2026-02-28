import {createRequire} from 'module';
import Subscription from "../Models/subscription.model.js";
import dayjs from "dayjs";
import {aws4} from "mongodb/src/deps.ts";
import {sendEmail} from "../utils/send-email.js";
const require = createRequire(import.meta.url)
const {serve} = require('@upstash/workflow/express');


const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context)=>{
    console.log('workflow started')
    const {subscriptionId} = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== 'active')return;

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())){
        console.log(`Renewal date has passed for subscription ${subscriptionId}.Stopping Worflow.`);
        return;
    }


    for (const daysBefore of REMINDERS){
        const reminderDate = renewalDate.subtract(daysBefore,'day');

        if (reminderDate.isAfter(dayjs())){
            await sleepsUntilReminder(context,`Reminder ${daysBefore} days before.`, reminderDate);


        await triggerReminder(context,`Reminder ${daysBefore} days before`);
    }}
});

const fetchSubscription = async (context, subscriptionId)=> {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email')
    })
}
    const sleepsUntilReminder = async (context, label, date) => {
        console.log(`sleep until ${label} remind at ${date}`);
        await context.sleepUntil(label,date.toDate());
    }

    const triggerReminder = async (context, label) => {
        return await context.run(label, async () => {
            console.log(`Trigger ${label} reminder`);

            await sendEmail({
                to: subscription.user.mail,
                type: reminder.label.subscription,
            })
        })
    }
