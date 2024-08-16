import { UserNotificationRepo } from "../repository/userNotificationRepository";
import { FunctionReturnType } from "../helper/reusable";
import { ISubscription } from "../models/subscriptionModel";


interface IReview {
    username: string;
    title: string;
    date: string;
    text: string;
  }
  

export class UserNotificationService{

    async userNotification(id:string):Promise<FunctionReturnType>{
        const response = await UserNotificationRepo.userNotification(id)
        return response
    }


    async callUser(id:string):Promise<FunctionReturnType>{
        const response = await UserNotificationRepo.callUser(id);
        return response;
    }


    async pushNotification(subscription:ISubscription,id:string):Promise<FunctionReturnType>{

        const response = await UserNotificationRepo.pushNotification(subscription,id);
        return response
    }


    async accountDetails(userid:string):Promise<FunctionReturnType>{
        const response = await UserNotificationRepo.accountDetails(userid);
        return response
    }


    async editUserInfo(email:string,username:string,userid:string):Promise<FunctionReturnType>{
        const response = await UserNotificationRepo.editUserInfo(email,username,userid);
        return response
    }

    async editUserPassword(confirmPassword:string,newPassword:string,oldPassword:string,userid:string):Promise<any>{
        
        
        const response = await UserNotificationRepo.editUserPassword(confirmPassword,newPassword,oldPassword,userid)
        return response
    }

    async fetchReview(userId:string):Promise<any>{
        const response = await UserNotificationRepo.fetchReview(userId);
        return response
    }

    async addReview(newReview:IReview,userId:string,id:string):Promise<any>{
     const response = await UserNotificationRepo.addReview(newReview,userId,id);
     return response
    }


    async fetchRating(userId:string):Promise<any>{
        const response = await UserNotificationRepo.fetchRating(userId);
        return response
    }
}