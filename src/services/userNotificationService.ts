import { UserNotificationRepo } from "../repository/userNotificationRepository";
import { FunctionReturnType } from "../helper/reusable";
import { ISubscription } from "../models/subscriptionModel";

export class UserNotificationService{

    async userNotification(id:string):Promise<FunctionReturnType>{
        const response = await UserNotificationRepo.userNotification(id)
        return response
    }


    async callUser(id:string):Promise<any>{
        const response = await UserNotificationRepo.callUser(id);
        return response;
    }


    async pushNotification(subscription:ISubscription,id:string):Promise<any>{

        const response = await UserNotificationRepo.pushNotification(subscription,id);
        return response
    }
}