import ProModel from "../models/proModel";
import { FunctionReturnType } from "../helper/reusable";

export class UserFavouriteRepo{

    static async allFavourites(id:string):Promise<FunctionReturnType>{
        try {
            const favoriteData = await ProModel.aggregate([
                {
                  $match: {
                    followedBy: { $in: [id] }
                  }
                },
                {$project:{
                    _id:0,
                    isAdminVerified:0,
                    __v:0
                }}
              ]);
              
            if(favoriteData){
                return {success:true,data:favoriteData}
            }else{
                return {success:false,message:'no favourite Mentors'}
            }
            
                                                                     
        } catch (error) {
            console.log(error);
            return {success:false,message:'error occur while fetching favourite mentors !!!'}
            
        }
    }
}