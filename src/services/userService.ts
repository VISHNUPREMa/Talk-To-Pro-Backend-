import {UserRepository} from "../repository/userRepository";
import bcrypt from 'bcrypt';
import sendEmailOtp from "../helper/emailService";
import { v4 as uuidv4 } from 'uuid';


export class UserService {
    private otp: any;

    async signup(userData: any) {
        const existingUser = await UserRepository.findUserByEmail(userData.email);
        if(existingUser){
            throw new Error("Email already in use.");
        }

        const saltRounds:number = 10;
        const hashedPassword = await bcrypt.hash(userData.password,saltRounds)

               
        const userId = uuidv4();
        const data ={
            userId: userId, 
            username:userData.username,
            email:userData.email,
            password:hashedPassword,
            isAdmin: false,
            isServiceProvider: false,
            isBlocked:false,
            isVerified : false,
            createdAt : new Date()
        }
     
        
        
        const user = await UserRepository.createUser(data);

         this.otp = Math.floor(100000 + Math.random() * 900000);
         console.log(this.otp);
         
       await sendEmailOtp(userData.email,this.otp)
    
    }




    async signupOtp(userOtp:number | string, email:string){
       console.log(userOtp);
       console.log(this.otp);
       if(userOtp == this.otp){
        await UserRepository.verifyUser(email);
       }else{
        throw new Error("Invalid otp");

       }
       
       
        
    }

    async loginUserData(email: string, password: string): Promise<{ userInfo: { username: string; email: string }; token: string } |any| null> {
        return UserRepository.validateLoginUser(email, password);
    }

    async googleAuthValidate (userEmail:string):Promise<{ user: { username: string; email: string }; token: string } | null>{
       return UserRepository.googleAuthUser(userEmail)
        

    }


    async getProData():Promise<any>{
        try {

            const proData = await UserRepository.getAllProData();
            return proData
            
            
        } catch (error) {
            console.log(error);
            
            
        }
    }


    async forgetPasswordEmail(email : string): Promise<{ success: boolean; message: string;otp?: number }>{
        try {
            const response = await UserRepository.forgetPasswordEmail(email);
            return response
            
        } catch (error) {
            console.log(error);
            return { success: false, message: 'An error occurred while processing your request' };
            
            
        }
        
    }

    async forgetPasswordOtp (otpValue:string,email:string): Promise<{ success: boolean; message: string  }>{
        try {
            const response = await UserRepository.forgetPasswordOtp(otpValue,email)
            return response
            
        } catch (error) {
            console.log(error);
            return {success:false,message:"error !!!"}
            
        }
    }

    async resetPassword(email:string, newPassword:string): Promise<{ success: boolean; message: string  }>{
        try {
            const response = await UserRepository.resetPassword(email,newPassword)
            return response
            
            
            
        } catch (error) {
            console.log(error);
            return {success:false,message:"error !!!"}
            
        }
    }


    async getAvailableSlots(id:string):Promise<{success:boolean,data?:any}>{
        try {
            const response = await UserRepository.getAvailableSlots(id)
            return response
        } catch (error) {
            return {success:false}
        }
    }



    async bookSlot(data:{userid:string,amount:string,selectedDate:string,selectedTimeSlot:string,proId:string}):Promise<{success:boolean,message:string}>{
        try {
            const response = await UserRepository.bookSlot(data);
            return response
        } catch (error) {
            console.log(error);
            return {success:false , message:"slot book page error !!!"}
        }
    }

    async userBookings(userId:string):Promise<any>{
        try {
            const response = await UserRepository.userBookings(userId)
            return response
        } catch (error) {
            
        }
    }


    async userTransactions(userId:string):Promise<any>{
        try {
            const response = await UserRepository.userTransactions(userId)
            return response
        } catch (error) {
            
        }
    }


}

