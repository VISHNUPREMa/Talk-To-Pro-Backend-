import UserModel from '../models/userModel';
import ProModel from '../models/proModel';
import BookingModel from '../models/bookingModel';
import WalletModel from '../models/walletModel';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { decode } from 'punycode';
import { FunctionReturnType } from '../helper/reusable';


interface Slot {
  time: string;
  status: string;
}

interface BookingData {
  bookingId: string;
  providedBy: string;
  date: string;
  slots: Slot[];
  createdAt: number;
}

interface SaveSlotsResult {
  success: boolean;
  message: string;
  data?: Slot[];
}

interface IUpdateData{
  profilePic? : string, 
  linkedinUrl? :string
}


export class ProRepository {

  static async registerPro(data: any): Promise<FunctionReturnType> {
    try {
      const { token, profession, domains, experience, languages, description, profilePic } = data;
      console.log([token, profession, domains, experience, languages, description, profilePic]);
      
      const decoded: any = jwt.verify(token,process.env.JWT_REFRESH_SECRET_KEY!);
      console.log(decode);
      
      const { id, email } = decoded;

      const user = await UserModel.findOne({ email });
      if (user && user.isServiceProvider === false) {
        const proData = {
          userid: id,
          email: email,
          profession: profession,
          domain: domains.split(",").map((domain: string) => domain.trim()), 
          experience: experience,
          languages: languages.split(",").map((language: string) => language.trim()), 
          description: description,
          profilepic: profilePic,
          isBlocked: false,
          isAdminVerified:false
        };

        const newPro = new ProModel(proData);
        await newPro.save();
        user.isServiceProvider = true;
        await user.save();

        return {success:true,data:newPro};
      } else {
        console.log('Profile already registered as a service provider!');
        return {success:false, message: 'Profile already registered as a service provider!' };
      }
    } catch (error) {
      console.log("Error in ProRepository registerPro method: ", error);
      return {success:false, data:error };
    }
  }




  static async saveAvailableSlots(data: any): Promise<FunctionReturnType> {
    try {
      const { date, slots, id, amount } = data;
    
      const dateToCheck = new Date(date);
      const formattedDate = dateToCheck.toISOString().split('T')[0]; // YYYY-MM-DD
  
   
      const bookingsOnDate = await BookingModel.find({
        providedBy:id,
        date: { $regex: `^${formattedDate}` }
      });
  
      const transformedSlots: Slot[] = slots.map((slot: string) => ({
        time: slot,
        status: 'Pending',
        amount:amount
      }));
             
      if (bookingsOnDate.length > 0) {
       
       
        for (const booking of bookingsOnDate) {
        
          const existingSlots = booking.slots.map((s: Slot) => s.time);
          const newSlots = transformedSlots.filter(s => !existingSlots.includes(s.time));
  
        
          if (newSlots.length > 0) {
            booking.slots.push(...newSlots);
            await booking.save(); 
          }
        }
  
        console.log('Updated existing bookings with new slots.');
      } else {
        
        console.log('No bookings found for the date. Creating a new booking.');
  
        const bookingId = uuidv4();
        const bookingData = {
          bookingId: bookingId,
          providedBy: id,
          date: date,
          slots: transformedSlots,
          createdAt: new Date(),
        };
  
        await BookingModel.create(bookingData);
      }
  
      return { success: true, message: 'Allocate slot successfully !!!' };
    } catch (error) {
      console.log("Error in ProRepository saveAvailableSlots method: ", error);
      return { success: false, message: 'Error !!!' };
    }
  }
  
  


  static async getAllocatedSlot(proId: string): Promise<FunctionReturnType> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const preAllocatedSlot = await BookingModel.find(
        {
          providedBy: proId,
          $expr: {
            $gte: [{ $dateFromString: { dateString: "$date" } }, today]
          }
        },
        {
          date: 1,
          slots: 1,
          _id: 0
        }
      ).lean();  
  
      return { success: true, data: preAllocatedSlot };
    } catch (error) {
      console.log("Error in ProRepository getAllocatedSlot method: ", error);
      return { success: false ,data:error};
    }
  }
  


  static async singlePro(userId:string):Promise<FunctionReturnType>{
    try {
      console.log("a");
      const proData = await ProModel.aggregate([
        { $match: { userid: userId } },
        {
          $lookup: {
            from: 'users',
            localField: 'userid',
            foreignField: 'userId',
            as: 'userdetails'
          }
        },
        {
          $unwind: '$userdetails'
        },
        {
          $project:{
            _id:0,
            profession:1,
            domain:1,
            experience:1,
            languages:1,
            profilepic:1,
            description:1,
            isBlocked:1,
            followedBy:1,
            reviews:1,
            linkedinUrl:1,
            'userdetails.username':1
          }
        }
      ]);
      
   
      
    
      
      
      return {success:true,data:proData}
    } catch (error) {
      return{success:false,message:'error while fetch professional data : '}
    }
  }
                                 
 
  static async followPro(userId:string,proId:string):Promise<FunctionReturnType>{
    try {
     const proData = await ProModel.findOne({userid:proId});
     console.log("pro data : ",proData);
     
     if(proData){
     
      if(!proData.followedBy.includes(userId)){
        proData.followedBy.push(userId);
        await proData.save();
        return {success:true,message:'follow successfully'}
      }else{
        return {success:false,message:'Already Followed'}
      }
     }else{
      return {success:false , message:'Invalid '}
     }
     
      
      
    } catch (error) {
      console.log(error);
      return {success:false,data:error}
      
    }
  }


  static async unFollowPro(userId:string,proId:string):Promise<FunctionReturnType>{
    try {
      const result = await ProModel.updateOne(
        { userid: proId },
        { $pull: { followedBy: userId } }
      );

      if(result){
        return {success:true,message:'unfollow successfully !!!'}
      }else{
        return {success:false,message:'user is not followed'}
      }
      
      
    } catch (error) {
      console.log(error);
      return {success:false,data:error}
      
    }
  }


  static async addRating(stars: number, toId: string, bookingId: string, bookTime: string): Promise<FunctionReturnType> {
    try {
    
      const proData = await ProModel.updateOne(
        { userid: toId },
        { $push: { reviews: stars } }
      );
  
      console.log([bookingId, bookTime]);
  
      if (proData.modifiedCount > 0) {
    
     const bookingData = await BookingModel.findOneAndUpdate(
      { bookingId: bookingId, 'slots.time': { $regex: bookTime } },
      { $set: { 'slots.$.status': 'Done' } },
      { new: true }
    );
     
      
        if (bookingData) {
       
          return { success: true, message: 'Rating added successfully, and booking status updated to Done!' };
        } else {
          console.log("no");
          return { success: false, message: 'Booking not found or no change made.' };
        }
      } else {
        return { success: false, message: 'No change in professional data.' };
      }
    } catch (error) {
      console.log(error);
      return { success: false, data: error };
    }
  }


  static async editProDetails(userid:string,changedDetails:any):Promise<FunctionReturnType>{
    try {
      const proData = await ProModel.findOne({userid:userid});
      if(proData){
        
        changedDetails.forEach((ele: { [key: string]: any }) => {
          
          const eleKeys = Object.keys(ele);
          const proDataKeys = Object.keys(proData.toObject()); 
          
      
          const isMatching = eleKeys.every(key => proDataKeys.includes(key));
          
          if (isMatching) {
              console.log("Matching keys:", eleKeys);
              // Apply changes
              Object.assign(proData, ele);
          }
      });

      console.log("pro data : ",proData);
      

       await proData.save();
        
        
        return {success:true,message:'professional details changed successfully !!!'}
      }else{
        return {success:false,message:'professional details not found'}
      }
    } catch (error) {
      console.log(error);
      return {success:false,data:error,message:'error occur on pro editing'}
    }
  }



  static async editProfilePic(updateData: IUpdateData, userid: string): Promise<FunctionReturnType> {
    try {
      const proData = await ProModel.findOne({ userid });
  
      if (!proData) {
        return { success: false, message: 'Profile not found !!!' };
      }
    
      console.log("update : ",updateData);
      

   
    
      if (updateData?.profilePic) {
        console.log("a b ",updateData.profilePic);
        
        proData.profilepic = updateData.profilePic;
      }
  
      if (updateData?.linkedinUrl) {
        proData.linkedinUrl = updateData.linkedinUrl;
      }
     console.log(proData);
     
      await proData.save();
      return { success: true, message: 'Changes updated successfully !!!' };
    } catch (error) {
      return { success: false, data: error as any, message: 'Error occurred while changing profile pic !!!' };
    }
  }
 

  static async cancelBooking(slot: string, selectedDate: string, proId: string): Promise<FunctionReturnType> {
    try {
      const dateRegex = new RegExp(`^${selectedDate.slice(0, 10)}`);
      let from = "";
      let amount = "";
      
      const bookingData = await BookingModel.findOne({
        providedBy: proId,
        date: { $regex: dateRegex }
      });
                                             
      if (bookingData) {
        bookingData.slots = bookingData.slots.map((slotData: any) => {
          if (slotData.time === slot) {
            slotData.status = "Cancelled";
            from = slotData.bookedBy;
            amount = slotData.amount;
          }
          return slotData;
        });
  
        console.log("proId:", proId);
        console.log("from:", from);
        
        let proWalletData = await WalletModel.findOne({ walletBy: proId });
        let userWalletData = await WalletModel.findOne({ walletBy: from });
  
        console.log("bookingData:", bookingData);
        console.log("proWalletData:", proWalletData);
  
        if (proWalletData) {
          if (proWalletData.totalAmount >= Number(amount)) {
            proWalletData.totalAmount -= Number(amount);
            proWalletData.walletDetails.push({
              from: from,
              amount: amount,
              status: "Debited"
            });
          } else {
            return { success: false, message: 'Insufficient funds in wallet to deduct the amount.' };
          }
        } else {
          proWalletData = new WalletModel({
            walletId: uuidv4(),
            walletBy: proId,
            walletDetails: [{
              from: from,
              amount: amount,
              status: "Debited"
            }],
            totalAmount: -Number(amount) // Start with a negative balance if the wallet didn't exist
          });
        }
  
        if (userWalletData) {
          userWalletData.totalAmount += Number(amount);
          userWalletData.walletDetails.push({
            from: proId,
            amount: amount,
            status: "Credited"
          });
        } else {
          userWalletData = new WalletModel({
            walletId: uuidv4(),
            walletBy: from,
            walletDetails: [{
              from: proId,
              amount: amount,
              status: "Credited"
            }],
            totalAmount: Number(amount)
          });
        }
  
        console.log("userWalletData:", userWalletData);
        
        // Save updated Booking, Professional Wallet, and User Wallet data
        await bookingData.save();
        await proWalletData.save();
        await userWalletData.save();
  
        return { success: true, message: 'Cancelled Booking successfully!!!' };
      } else {
        console.log("Booking not found");
        return { success: false, message: 'Booking not found' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Error occurred while canceling the booking' };
    }
  }
  



}
