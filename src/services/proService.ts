import { ProRepository } from "../repository/proRepository";

export class ProService{

    async register(data:any ){
  
        const proData = await ProRepository.registerPro(data);
        console.log("pro data in register in pro service : ",proData);
            return proData    
    }

    async saveAvailableSlots(data:any): Promise<{success:boolean,message:string}>{
        try {
             const response = await ProRepository.saveAvailableSlots(data);
              return response
        } catch (error) {
            console.log(error);
            return {success:true,message:"error"}
        }
    }

    async getAllocatedSlot(proId:string):Promise< any>{
        try {
             const response = await ProRepository.getAllocatedSlot(proId)
             return response
        } catch (error) {
          console.log(error);
          return {success:false} 
        }
    }


}