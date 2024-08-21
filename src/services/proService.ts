import { ProRepository } from "../repository/proRepository";
import { FunctionReturnType } from "../helper/reusable";

interface ProfessionalData {
    profession: string;
    domains: string;
    experience: string;
    languages: string;
    profilePic: File | null;
    description: string;
  }

  interface IUpdateData{
    profilePic? : string, 
    linkedinUrl? :string
}


export class ProService{
    

    async register(data:ProfessionalData ):Promise<FunctionReturnType>{
  
        const proData = await ProRepository.registerPro(data);
            return proData    
    }

    async saveAvailableSlots(data:any): Promise<FunctionReturnType>{
             const response = await ProRepository.saveAvailableSlots(data);
              return response
    
    }

    async getAllocatedSlot(proId:string):Promise<FunctionReturnType>{
    
             const response = await ProRepository.getAllocatedSlot(proId)
             return response
    }


    async singlePro(userId:string):Promise<FunctionReturnType>{

        const response = await ProRepository.singlePro(userId);
        return response
    }


    async followPro(proId:string,userId:string):Promise<FunctionReturnType>{
        const response = await ProRepository.followPro(proId,userId);
        return response
    }

    async unFollowPro(proId:string,userId:string):Promise<FunctionReturnType>{
        const response = await ProRepository.unFollowPro(proId,userId);
        return response
    }


    async addRating(stars:number,toId:string,bookingId:string,bookTime:string):Promise<FunctionReturnType>{
        const response = await ProRepository.addRating(stars,toId,bookingId,bookTime);
        return response
    }

    async editProDetails(changedDetails:any,userid:string):Promise<FunctionReturnType>{
        const response = await ProRepository.editProDetails(userid,changedDetails);
       return response
       
    }

    async editProfilePic(updateData:IUpdateData,userid:string):Promise<any>{
        const response = await ProRepository.editProfilePic(updateData,userid);
        return response
    }


    async cancelBooking(slot:string,selectedDate:string,proId:string):Promise<any>{
        try {
            const response = await ProRepository.cancelBooking(slot,selectedDate,proId);
            return response
        } catch (error) {
            console.log();
            
        }
    }

}