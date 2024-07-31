import { ProRepository } from "../repository/proRepository";
import { FunctionReturnType } from "../helper/reusable";

export class ProService{
    

    async register(data:any ):Promise<FunctionReturnType>{
  
        const proData = await ProRepository.registerPro(data);
        console.log("pro data in register in pro service : ",proData);
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


}