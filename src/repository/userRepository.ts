
import UserModel, { IUser } from '../models/userModel';
import ProModel from '../models/proModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import sendEmailOtp from '../helper/emailService';
import BookingModel from '../models/bookingModel';
import TransactionModel from '../models/transactionModel';
import { v4 as uuidv4 } from 'uuid';




export class UserRepository {
  private static otp: number;
  static async createUser(userData: any): Promise<IUser> {
    try {
      console.log("Creating new user with data:", userData);
      const newUser = new UserModel(userData);
      console.log("New user created:", newUser);
      return await newUser.save();
    } catch (error: any) {
      console.error("Error creating user:", error);
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  static async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      console.log("Finding user with email:", email);
      const user = await UserModel.findOne({ email });
      console.log("User found:", user);
      return user;
    } catch (error: any) {
      console.error("Error finding user by email:", error);
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }


  static async verifyUser(email:string):Promise<any>{
    console.log("update  user details  with email:", email);
    const user = await UserModel.findOneAndUpdate({ email }, { isVerified: true}, { new: true });
    return user;

  }

  static async validateLoginUser(email:string,password:string):Promise<any>{
   try {
    const user = await UserModel.findOne({ email },{_id:0,userId:1,username:1,email:1,password:1,isBlocked:1,isServiceProvider:1});


    
    if (!user) {
      return { error: 'User not found' };
    }


    const isValidPassword = await bcrypt.compare(password,user.password);
    if(!isValidPassword){
      return { error: 'Invalid password' };
    }

    if(user.isBlocked){
      return { error: 'User Blocked' };
    }
    
    const accessToken = jwt.sign(
      { id: user.userId, email: user.email },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user.userId, email: user.email },
      process.env.JWT_REFRESH_SECRET_KEY!,
      { expiresIn: '7d' }
    );

    
    
    const userInfo = {
      username: user.username,
      email: user.email,
      isServiceProvider:user.isServiceProvider,
      userid:user.userId
  };
  
       
       
    return { userInfo, accessToken , refreshToken  };
    
    
   } catch (error) {
    console.error('Error validating user login:', error);
     return null;
    
   }
    
  }


  static async googleAuthUser(userEmail:string):Promise<any>{
    try {
      const user = await UserModel.findOne({ email:userEmail },{_id:0,username:1,email:1});
      if(!user){
        throw new Error('User not with same email in google account');

      }

      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });
      return {user , token}
      
      
      
      
    } catch (error) {
      
    }
  }


  static async  getAllProData():Promise<any>{
    try {
      const allProData = await ProModel.find({ isBlocked: false });

      return allProData
      
      
    } catch (error) {
      console.log(error);
      
      
    }

  }


  static async forgetPasswordEmail(email:string): Promise<{ success: boolean; message: string; otp?: number  }>{
    try {
      const user = await UserModel.findOne({email});
      if(user){
        this.otp = Math.floor(100000 + Math.random() * 900000);
        await sendEmailOtp(email, this.otp);
        console.log(this.otp);
        
        return { success: true, message: `user found otp sent successfully !!!`,otp: this.otp };
      }else{
        return { success: false, message: `Invalid Email Address` };
      }
      
      
    } catch (error) {
      console.log(error);
      return { success: false, message: `error occurs` };
      
    }
  }


  static async forgetPasswordOtp(otpValue:string,email:string): Promise<{ success: boolean; message: string  }>{
    try {
      const sendotp = Number(otpValue)
      if(sendotp === this.otp){
        return {success:true,message:"otp matched"}
        
      }else{
        return {success:false,message:"Invalid otp !!!"}
        
      }
      
      
    } catch (error) {
      console.log(error);
      return {success:false,message:"error !!!"}
      
    }
  }



  static async resetPassword(email:string,newPassword:string): Promise<{ success: boolean; message: string  }>{
    try {
      const user = await UserModel.findOne({email:email},{_id:1,email:1,password:1,isBlocked:1});
      if(!user){
        return {success:false,message:"no user found with this email"}
      }

      if(user.isBlocked){
        return {success:false,message:"User Blocked !!!"}
      }

      
        const saltRounds:number = 10;
        const hashedPassword = await bcrypt.hash(newPassword,saltRounds);
        user.password = hashedPassword;
        await user.save();
        return {success:true,message:"password changed successfully !!"}
        
      
      
      
      
    } catch (error) {
      console.log(error);
      return {success:false,message:"error !!!"}
      
    }
  }


  static async getAvailableSlots(id:string):Promise<{success:boolean,data?:any}>{
    try {
      const availableSlots = await BookingModel.find({providedBy:id},{_id:0,date:1,slots:1,amount:1,bookingId:1});
      
      return {success:true,data:availableSlots}
      
    } catch (error) {
      return {success:false}
    }
  }



 
static async bookSlot(data:{userid:string,amount:string,selectedDate:string,selectedTimeSlot:string,proId:string}): Promise<{success:boolean,message:string}> {
  try {
    const { userid, amount, selectedDate, selectedTimeSlot, proId } = data;
    const formattedDate = new Date(selectedDate).toISOString().split('T')[0];

    const bookingData = await BookingModel.findOne({
      providedBy: proId,
      date: { $regex: `^${formattedDate}` },
    });

    console.log("booking data:", bookingData);

   
    if (bookingData) {
 
      const updatedBookingData = await BookingModel.updateOne(
        {
          _id: bookingData._id,
          "slots.time": selectedTimeSlot,
        },
        {
          $set: {
            "slots.$.status": "Booked",
            "slots.$.bookedBy":userid
          },
        }
      );

      console.log("Updated booking data:", updatedBookingData);
      if (updatedBookingData.modifiedCount > 0) {
        console.log("updatedBookingData : ",bookingData);
        const transactionData = await TransactionModel.create({
          transactionId: uuidv4(),
          from:userid,
          to:bookingData.providedBy,
          amount:bookingData.amount,
          time:selectedTimeSlot,
          date:formattedDate,
          modeOfPay:'PayPal'

        });
        console.log("transactionData : ",transactionData);
        
        
        console.log(`Slot at ${selectedTimeSlot} successfully booked.`);
        return {success : true , message:`Slot at ${selectedTimeSlot} successfully booked.` }
      } else {
        console.log(`No slot found with the time ${selectedTimeSlot}.`);
        return {success : false , message:`No slot found with the time ${selectedTimeSlot}.` }
      }
    } else {
      console.log("No booking found for the given criteria.");
      return {success:false , message:"No booking found for the given criteria."}
    }
  } catch (error) {
    console.log("error:", error);
    return {success:false , message:"slot book page error !!!"}
  }
}


static async userBookings(userId:string):Promise<any>{
  try {
    const slicedBookings = await BookingModel.aggregate([
     
      { $match: { 'slots.bookedBy': userId } },
      
      { $unwind: '$slots' },
  
      { $match: { 'slots.bookedBy': userId } },
      {
        $lookup: {
          from: 'users',
          localField: 'providedBy',
          foreignField: 'userId',
          as: 'userInfo'
        }
      },
 
      { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
      
  
      { $project: {
        _id: 0,
        bookingId: 1,
        providedBy: 1,
        providedByUsername: { $ifNull: ['$userInfo.username', null] }, 
        date: 1,
        slots: 1,
        bookingFee: 1,
        createdAt: 1,
        updatedAt: 1,
        amount: 1
      }}
    ]).exec();

    console.log(slicedBookings);
    if(slicedBookings){
      return{success:true,data:slicedBookings}
    }
    
  } catch (error) {
    
  }
}


static async userTransactions(userId:string):Promise<any>{
  try {
    const transactions = await TransactionModel.find({
      $or: [
        { from: userId },
        { to: userId }
      ]
    });
    
    console.log('Transactions found:', transactions);
    
  } catch (error) {
    
  }
}
  
}




