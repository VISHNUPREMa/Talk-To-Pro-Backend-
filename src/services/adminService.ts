import { AdminRepository } from "../repository/adminReository";
import { FunctionReturnType } from "../helper/reusable";


export class  AdminService{
    async validateLogin (data:{ email: string; password: string }): Promise<FunctionReturnType> {
        
        const response = await AdminRepository.validateLogin(data);
        return response

    }

    async getAllUsers():Promise<FunctionReturnType>{

        const response = await AdminRepository.getAllUsers();
        return response

    }


    async blockUser(email: string): Promise<FunctionReturnType> {

            const response = await AdminRepository.blockUser(email);
            return response;
       
    }


    async unblockUser(email: string): Promise<FunctionReturnType> {

            const response = await AdminRepository.unblockUser(email);
            return response;
    }



    async getAllpro():Promise<FunctionReturnType>{
        const response = await AdminRepository.getAllpro();
        return response

    }



    async blockpro(id: string): Promise<FunctionReturnType> {
  
            const response = await AdminRepository.blockpro(id);
    
            return response;
     
    }


    async unblockpro(id: string): Promise<FunctionReturnType> {
        
            const response = await AdminRepository.unblockpro(id);
            
            
            return response;
       
    }

async getAllbooking():Promise<FunctionReturnType>{

        const response = await AdminRepository.getAllbooking();
        return response
   
}



async getAlltransaction():Promise<FunctionReturnType>{
    
        const response = await AdminRepository.getAlltransaction();
        return response
  
}

}