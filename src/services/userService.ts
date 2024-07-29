import {UserRepository} from "../repository/userRepository";
import bcrypt from 'bcrypt';
import sendEmailOtp from "../helper/emailService";
import { v4 as uuidv4 } from 'uuid';
import { FunctionReturnType } from "../helper/reusable";



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




    async signupOtp(userOtp:number | string, email:string):Promise<FunctionReturnType>{
       console.log(userOtp);
       console.log(this.otp);
       if(userOtp == this.otp){
       const response =  await UserRepository.verifyUser(email);
       return response
       }else{
        throw new Error("Invalid otp");

       }
         
    }




    async loginUserData(email: string, password: string): Promise<FunctionReturnType> {
        const response =  UserRepository.validateLoginUser(email, password);
        return response
    }




    async googleAuthValidate (userEmail:string):Promise<FunctionReturnType>{
       const response = UserRepository.googleAuthUser(userEmail)
        return response

    }





    async getProData():Promise<FunctionReturnType>{
    

            const proData = await UserRepository.getAllProData();
            return proData
    }




    async forgetPasswordEmail(email : string): Promise<FunctionReturnType>{
        
            const response = await UserRepository.forgetPasswordEmail(email);
            return response
        
    }



    async forgetPasswordOtp (otpValue:string,email:string): Promise<FunctionReturnType>{
        
            const response = await UserRepository.forgetPasswordOtp(otpValue,email)
            return response
      
    }



    async resetPassword(email:string, newPassword:string): Promise<FunctionReturnType>{
       
            const response = await UserRepository.resetPassword(email,newPassword)
            return response   
      
    }



    async getAvailableSlots(id:string):Promise<FunctionReturnType>{
      
            const response = await UserRepository.getAvailableSlots(id)
            return response
        
    }



    async bookSlot(data:{userid:string,amount:string,selectedDate:string,selectedTimeSlot:string,proId:string}):Promise<FunctionReturnType>{
            const response = await UserRepository.bookSlot(data);
            return response
    }



    async userBookings(userId:string):Promise<FunctionReturnType>{
        
            const response = await UserRepository.userBookings(userId)
            return response
    }



    async userTransactions(userId:string):Promise<FunctionReturnType>{
      
            const response = await UserRepository.userTransactions(userId)
            return response
        
    }


    async verifyToken(refreshToken:string):Promise<FunctionReturnType>{
        
        
        const response = await UserRepository.verifyToken(refreshToken)
        return response
    }


    async userSubscription(id:string,subscription: {endpoint: string;keys: {p256dh: string;auth: string;}}):Promise<FunctionReturnType>{

        const response = await UserRepository.userSubscription(id,subscription)
        return response
    }



   


}

