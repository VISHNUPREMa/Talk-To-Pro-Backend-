import { AdminRepository } from "../repository/adminReository";
import { FunctionReturnType } from "../helper/reusable";
import jwt ,{ JwtPayload } from 'jsonwebtoken';


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



async verifyToken(refreshToken:string):Promise<FunctionReturnType>{
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY!)as JwtPayload;
    const user = decoded.userId
        const response = await AdminRepository.verifyToken(user);
        return response
}

async getAllProRequests():Promise<any>{
        const response = await AdminRepository.getAllProRequests();
        return response   
}


async verifyProRequest(id:string):Promise<FunctionReturnType>{
        const response = await AdminRepository.verifyProRequest(id);
        return response
}


async getPIeChartData():Promise<any>{
        const response = await AdminRepository.getPIeChartData();
        return response
}


async getBarChartData():Promise<any>{
        const response = await AdminRepository.getBarChartData();
        return response
}

}