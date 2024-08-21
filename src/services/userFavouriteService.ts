import { UserFavouriteRepo } from "../repository/userFavouriteRepo";
import { UserNotificationRepo } from "../repository/userNotificationRepository";
import { FunctionReturnType } from "../helper/reusable";


export class UserFavouriteService{

    async allFavourites(id:string):Promise<FunctionReturnType>{
      const response = await UserFavouriteRepo.allFavourites(id);
      return response
    }
}