import { Request, Response } from "express";
import { UserService } from "../services/userService";


class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async signupUser(req: Request, res: Response) {
    try {
      const data = req.body;
      const user = await this.userService.signup(data);

      res.status(201).json({
        message: "Successfully signed up",
        user,
      });
    } catch (error: any) {
      console.error("Error during signup:", error);
      res.status(500).json({
        message: "An error occurred during signup",
        error: error.message,
      });
    }
  }

  async signupUserOtpValidate(req: Request, res: Response) {
    try {
      const { otpValue, email } = req.body;
      const response = await this.userService.signupOtp(otpValue, email);

      res.status(200).json({
        message: response,
      });
    } catch (error: any) {
      console.error("Error during OTP validation:", error);
      res.status(500).json({
        message: "An error occurred during OTP validation",
        error: error.message,
      });
    }
  }

  

  async loginUser(req:Request, res:Response){
try {
  
  const {email , password} = req.body;
  const data = await this.userService.loginUserData(email,password);
  console.log("data : ",data);
  
  if (data.error) {
    const status = data.error === 'User not found' ? 404 : 401;
    return res.status(status).json({ error: data.error });
  }
  
 
  
  res.status(200).json({ message: 'Login successful', data });
} catch (error) {
  console.log("loginUser  data error : ",error);
  
  
}
    
  }

  async loginGoogleAuth(req:Request, res:Response){
   try {
    const {userEmail} = req.body;
    const data = await this.userService.googleAuthValidate(userEmail);
    console.log("data ",data);
    
    res.status(200).json({message: 'Login successful', data })
    
   } catch (error) {
    console.log("error : ",error);
    
    
   }
    
    
  }
                                                                              
  async getCards(req:Request , res:Response){
    try {
      const cardData = await this.userService.getProData();
      if(cardData){
        res.status(200).json(cardData)
      }
      
      
    } catch (error) {
      
    }
  }

  async forgetPasswordEmail(req:Request , res:Response){
    try {
      const {email} = req.body;
      
      const response = await this.userService.forgetPasswordEmail(email);
      res.json(response)
      
      
      
    } catch (error) {
      console.log(error);
      
      
    }

  }


  async forgetPasswordOtp(req:Request , res:Response){
    try {
      const {otpValue, email} = req.body;
      const response = await this.userService.forgetPasswordOtp(otpValue,email)
      res.json(response)
      
    } catch (error) {
      console.log(error);
      
      
    }
  }


  async resetPassword(req:Request , res:Response){
    const {email, newPassword} = req.body;
    const response = await this.userService.resetPassword(email,newPassword)
    res.json(response)
    
  }


  async getAvailableSlots(req:Request , res:Response){
    try {
      const {id} = req.body;
      const response = await this.userService.getAvailableSlots(id);
      res.json(response)
    } catch (error) {
      
    }
  }

  async bookSlot(req:Request , res:Response){
    try {
      const data  = req.body;
      
      
      const response = await this.userService.bookSlot(data)
      res.json(response)
    } catch (error) {
      console.log(error);
      
    }
  }


  async userBookings (req:Request , res:Response){
    try {
      const {userId} = req.body;
      const response = await this.userService.userBookings(userId)
      res.json(response)
    } catch (error) {
      
    }
  }
   


  async userTransactions (req:Request , res:Response){
    try {
      const {userId} = req.body;
      const response = await this.userService.userTransactions(userId)
      return response
    } catch (error) {
      
    }
  }




}

export const userController = new UserController(new UserService());



