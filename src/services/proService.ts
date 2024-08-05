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


    async isUserCalled(proId:string,userId:string):Promise<FunctionReturnType>{

        const response = await ProRepository.isUserCalled(proId,userId);
        return response
    }


    async followPro(proId:string,userId:string):Promise<any>{
        const response = await ProRepository.followPro(proId,userId);
        return response
    }

    async unFollowPro(proId:string,userId:string):Promise<any>{
        const response = await ProRepository.unFollowPro(proId,userId);
        return response
    }


}