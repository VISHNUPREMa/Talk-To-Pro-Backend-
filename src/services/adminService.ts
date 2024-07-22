import { AdminRepository } from "../repository/adminReository";


export class  AdminService{
    async validateLogin (data:{ email: string; password: string }): Promise<{ success: boolean; message: string; token?: string }> {
        
        const response = await AdminRepository.validateLogin(data);
        return response
        
        
    }

    async getAllUsers():Promise<any>{
        const response = await AdminRepository.getAllUsers();
        return response

    }


    async blockUser(email: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await AdminRepository.blockUser(email);
           
            
            return response;
        } catch (error) {
            console.error('Error in blockUser service:', error);
            return { success: false, message: 'Error in blocking user.' };
        }
    }


    async unblockUser(email: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await AdminRepository.unblockUser(email);
         
            
            return response;
        } catch (error) {
            console.error('Error in blockUser service:', error);
            return { success: false, message: 'Error in blocking user.' };
        }
    }



    async getAllpro():Promise<any>{
        const response = await AdminRepository.getAllpro();
        return response

    }



    async blockpro(id: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await AdminRepository.blockpro(id);
            
            
            return response;
        } catch (error) {
            console.error('Error in blockUser service:', error);
            return { success: false, message: 'Error in blocking user.' };
        }
    }


    async unblockpro(id: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await AdminRepository.unblockpro(id);
            
            
            return response;
        } catch (error) {
            console.error('Error in blockUser service:', error);
            return { success: false, message: 'Error in blocking user.' };
        }
    }




}