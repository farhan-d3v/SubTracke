import Subscription from "../Models/subscription.model.js";
import {workflowClient} from "../config/upstash.js";


export const createSubscription = async (req, res, next) => {
    try {
    const subscription = await Subscription.create({
        ...req.body,
        user: req.user.id,
    });

    await workflowClient.trigger({
        url:`${process.env.SERVER_URL}/api/v1/workflows/subscription/reminder`,
        body:{
            subscriptionId :subscription.id,
        },
        headers:{
            'content-type':'application/json',
        },
        retries: 0,
    })

    res.status(201).json({success: true, data: subscription});
    }catch(error){
        next(error);
    }
}

export const getAllSubscriptions = async (req, res, next) =>{
     try {
    const subscriptions = await Subscription.find();
    res.status(200).json({success:true ,data:subscriptions});
     }catch (error) {
         next(error);
     }
}

