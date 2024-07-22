import UserModel from '../models/userModel';
import ProModel from '../models/proModel';
import BookingModel from '../models/bookingModel';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

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

  static async registerPro(data: any): Promise<any> {
    try {
      const { token, profession, domains, experience, languages, description, profilePic } = data;
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);
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

        return newPro;
      } else {
        console.log('Profile already registered as a service provider!');
        return { error: 'Profile already registered as a service provider!' };
      }
    } catch (error) {
      console.log("Error in ProRepository registerPro method: ", error);
      
    }
  }

  static async saveAvailableSlots(data: any): Promise<{success:boolean,message:string}> {
    try {
      console.log("data in repository : ", data);
      const { date, slots, id,amount } = data;
      const transformedSlots: Slot[] = slots.map((slot: string) => ({
        time: slot,
        status: 'Pending'  
      }));
      
      console.log("transformedSlots : ", transformedSlots);
      
      const bookingId = uuidv4();

      const bookingData = {
        bookingId: bookingId,
        providedBy: id,
        date: date,
        slots: transformedSlots,
        createdAt: Date.now(),
        amount:amount
      };

      const booking = await BookingModel.create(bookingData);
      return { success: true, message: 'Allocate slot successfully !!!' }
    } catch (error) {
      console.log("Error in ProRepository saveAvailableSlots method: ", error);
      return { success: false, message: 'Error !!!' }
    }
  }

  static async getAllocatedSlot(proId: string): Promise<{success: boolean, data?: any}> {
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
      return { success: false };
    }
  }
  

 


}
