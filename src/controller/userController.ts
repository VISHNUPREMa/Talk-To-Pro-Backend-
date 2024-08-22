import { Request, response, Response } from "express";
import { UserService } from "../services/userService";
import { UserNotificationService } from "../services/userNotificationService";
import { PaymentService } from '../services/paymentService';
import { UserFavouriteService } from "../services/userFavouriteService";


class UserController {
  private userService: UserService;
  private userNotificationService: UserNotificationService;
  private paymentService : PaymentService;
  private userFavouriteService : UserFavouriteService;

  constructor(userService: UserService,userNotificationService: UserNotificationService,paymentService: PaymentService , userFavouriteService : UserFavouriteService) {
    this.userService = userService;
    this.userNotificationService = userNotificationService;
    this.paymentService = paymentService;
    this.userFavouriteService = userFavouriteService;
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
   res.json(data)
  
 
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
      const { page, limit} = req.body;
      
      
      const cardData = await this.userService.getProData(page,limit);
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
      console.log("ddata in controller : ",data);
      
      
      
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
      res.json(response)
    } catch (error) {
      
    }
  }


  async verifyToken(req:Request , res:Response){
    try {
      const {refreshToken} = req.body;
   
     
      const response = await this.userService.verifyToken(refreshToken);
     res.status(200).json(response)
      
      
    } catch (error) {
      console.log(error);
      
    }
  }



 


  async userNotification(req: Request, res: Response) {
    try {
     
      const { id } = req.body;
      const response = await this.userNotificationService.userNotification(id);
      res.json(response);
    } catch (error) {
      console.log(error);
    }
  }

  async callUser(req: Request, res: Response){
    try {
  
      const { id } = req.body;
      const response = await this.userNotificationService.callUser(id);
      res.json(response)
    } catch (error) {
      console.log(error);
      
    }
  }

  async pushNotification(req: Request, res: Response){
    try {
      const {subscription , id} = req.body;
      const response = await this.userNotificationService.pushNotification(subscription,id)
      res.json(response)
    } catch (error) {
      console.log(error);
      
    }
  }

  async accountDetails(req: Request, res: Response){
    try {
      const {userid} = req.body;
      const response = await this.userNotificationService.accountDetails(userid)
      res.json(response)
    } catch (error) {
      console.log(error);
      
    }
  }


  async editUserInfo(req: Request, res: Response){
    try {
      const {email,username ,userid} = req.body;
      const response = await this.userNotificationService.editUserInfo(email,username,userid)
      res.json(response)
    } catch (error) {
      console.log(error);
      
    }
  }


  async editUserPassword(req: Request, res: Response){
    try {
      const {confirmPassword,newPassword,oldPassword,userid} = req.body;
     
      
      const response = await this.userNotificationService.editUserPassword(confirmPassword,newPassword,oldPassword,userid)
      res.json(response)
    } catch (error) {
      console.log(error);
      
    }
  }


  async fetchReview(req: Request, res: Response){
    try {
      const {userId} = req.body;
      const response = await this.userNotificationService.fetchReview(userId)
      res.json(response)
    } catch (error) {
      console.log(error);
      
    }
  }


  async addReview(req: Request, res: Response){
    try {
      const {newReview,userId,id} = req.body;
     const response = await this.userNotificationService.addReview(newReview,userId,id)
     res.json(response)
      
    } catch (error) {
    console.log(error);
      
    }
  }


  async fetchRating(req: Request, res: Response){
    try {
      const {userId} = req.body;
      const response = await this.userNotificationService.fetchRating(userId);
      res.json(response)
    } catch (error) {
      console.log(error);
      
    }
  }


  async editReview(req: Request, res: Response){
    try {
      const {editedReview,userId} = req.body;
      const response = await this.userNotificationService.editReview(editedReview,userId)
      res.json(response)
    } catch (error) {
      console.log(error);
      
    }
  }

  
  async deleteReview(req: Request, res: Response){
    try {
      const {review,userId} = req.body;
      console.log([review,userId]);
      
      const response = await this.userNotificationService.deleteReview(review,userId)
      res.json(response)
    } catch (error) {
      console.log(error);
      
    }
  }


  async cancelBooking(req: Request, res: Response){
    try {
      const {bookingId,cancelBy,time,date} = req.body;
      const response = await this.userNotificationService.cancelBooking(bookingId,cancelBy,time,date)
      res.json(response)
    } catch (error) {
      console.log(error);
      
    }
  }


  async fetchWallet(req: Request, res: Response){
    try {
      const {userId} = req.body;
      const response = await this.userNotificationService.fetchWallet(userId);
      res.json(response)
    } catch (error) {
      console.log(error);
      
    }
  }

  async createOrder(req: Request, res: Response) {
    try {
      const { amount } = req.body;
      const order = await this.paymentService.createOrder(amount);
      res.status(200).json(order);
    } catch (error:any) {
      console.error('Error creating Razorpay order:', error);
      res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
  }

  async verifyPayment(req: Request, res: Response) {
    try {
      const { orderId, paymentId, signature ,amount,id} = req.body;
      const isValid = this.paymentService.verifyPaymentSignature(orderId, paymentId, signature);
      if (isValid) {
       
        
        const response = await this.userNotificationService.updateWallet(amount,id);
        if(response){
          console.log("response : ",response);
          
          res.status(200).json({ message: 'Payment verified successfully' });
        }
        
      } else {
        res.status(400).json({ message: 'Payment verification failed' });
      }
    } catch (error:any) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ message: 'Payment verification failed', error: error.message });
    }
  }

  async allFavourites(req: Request, res: Response) {
    try {
      const {id} = req.body;
      const response = await this.userFavouriteService.allFavourites(id)
      res.json(response)
    } catch (error) {
      console.log(error);
      
    }
  }

}

export const userController = new UserController(new UserService(), new UserNotificationService() ,new PaymentService(), new UserFavouriteService());




