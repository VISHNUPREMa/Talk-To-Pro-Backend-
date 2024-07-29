import { UserNotificationRepo } from "../repository/userNotificationRepository";
import { FunctionReturnType } from "../helper/reusable";

export class UserNotificationService{

    async userNotification(id:string):Promise<FunctionReturnType>{
        const response = await UserNotificationRepo.userNotification(id)
        return response
    }
}