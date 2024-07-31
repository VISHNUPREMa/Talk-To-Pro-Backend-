import UserModel, { IUser } from '../models/userModel';
import ProModel from '../models/proModel';
import BookingModel from '../models/bookingModel';
import TransactionModel from '../models/transactionModel';
import { FunctionReturnType } from '../helper/reusable';



export class UserNotificationRepo{
    static async userNotification(id:string):Promise<FunctionReturnType>{
       try {

        const bookings = await BookingModel.aggregate([
          {
            $match: {
              $or: [
                { providedBy: id },
                { 'slots.bookedBy': id },
              ],
            },
          },
          {
            $unwind: '$slots', // Unwind the slots array
          },
          {
            $lookup: {
              from: 'users',
              localField: 'providedBy',
              foreignField: 'userId',
              as: 'providedByUser',
            },
          },
          {
            $unwind: '$providedByUser',
          },
          {
            $lookup: {
              from: 'users',
              localField: 'slots.bookedBy',
              foreignField: 'userId',
              as: 'bookedByUser',
            },
          },
          {
            $unwind: '$bookedByUser',
          },
          {
            $project: {
              _id: 0,
              date: 1,
              'slots.time': 1,
              'slots.status': 1,
              'slots.amount': 1,
              'slots.bookedBy': 1,
              providedBy: '$providedByUser.username',
              bookedBy: '$bookedByUser.username',
              createdAt: 1,
              updatedAt: 1,
            },
          },
          // Group by date, createdAt, and updatedAt
          {
            $group: {
              _id: {
                date: '$date',
                createdAt: '$createdAt',
                updatedAt: '$updatedAt',
              },
              slots: {
                $push: {
                  time: '$slots.time',
                  status: '$slots.status',
                  amount: '$slots.amount',
                  bookedBy: '$bookedBy',
                },
              },
              providedBy: { $first: '$providedBy' },
            },
          },
          {
            $unwind: '$slots', // Unwind the slots array again to have separate documents for each slot
          },
          {
            $project: {
              _id: 0,
              date: '$_id.date',
              updatedAt: '$_id.updatedAt',
              time: '$slots.time',
              status: '$slots.status',
              amount: '$slots.amount',
              bookedBy: '$slots.bookedBy',
              providedBy: 1,
            },
          },
        ]);

          if(bookings){
            return {success:true,data:bookings,message:"ALL BOOKINGS"}
          }else{
            return {success:false,message:'NO BOOKINS'}
          }
       } catch (error) {
         return {success:false,data:error}
       } 
        
    }


    static async callUser(id:string):Promise<any>{
      try {
        const now = new Date();
   
        const currentFormattedTime = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(now).slice(0,2);
        const currentDate = now.toISOString().split('T')[0]; 
        
        console.log(`Current time: ${currentFormattedTime}`);
        console.log(`Current date: ${currentDate}`);
        console.log(typeof(currentFormattedTime));
        


        const bookingData = await BookingModel.aggregate([
          { $unwind: "$slots" },
          {
            $match: {
              $or: [
                { providedBy: id },
                { "slots.bookedBy": id }
              ],
            }
          },
          {
            $match: {
              $and: [
                { date: { $regex: currentDate } },
                { "slots.time": { $regex: '12' } }
              ]
            }
          }
        ]);
    
        
        
    
       const sentData =  id === bookingData[0].providedBy? bookingData[0].slots.bookedBy : bookingData[0].providedBy;
       console.log(sentData);
       
        if(sentData){
          return {success : true,data:sentData}
        }else{
          return {success : true,message:'no booking data'}
        }
        
        
      } catch (error) {
        console.log(error);
        return {success : false,data:error}
        
      }
    }
}