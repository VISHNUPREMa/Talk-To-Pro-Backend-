import UserModel from '../models/userModel';
import ProModel from '../models/proModel';
import BookingModel from '../models/bookingModel';
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
          isBlocked: false
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
  

 


}
