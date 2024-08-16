import UserModel from '../models/userModel';
import ProModel from '../models/proModel';
import BookingModel from '../models/bookingModel';
import TransactionModel from '../models/transactionModel';
import { FunctionReturnType } from '../helper/reusable';
import { ISubscription } from '../models/subscriptionModel';
import SubscriptionModel from '../models/subscriptionModel';
import ReviewModel from '../models/reviewModel';
import bcrypt from 'bcrypt'



interface IReview {
  username: string;
  title: string;
  date: string;
  text: string;
}

export class UserNotificationRepo{


  static async userNotification(id: string): Promise<FunctionReturnType> {
    try {
     
      
      const currentDate = new Date();
      const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)).toISOString();
      console.log(startOfDay);
  
     
  
      const bookings = await BookingModel.aggregate([
        {
          $match: {
            $and: [
              {
                $or: [
                  { providedBy: id },
                  { 'slots.bookedBy': id },
                ],
              },
              { date: { $gte: startOfDay } },
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
      if (bookings.length > 0) {
        return { success: true, data: bookings, message: "ALL BOOKINGS" };
      } else {
        return { success: false, message: 'NO BOOKINGS' };
      }
    } catch (error) {
      return { success: false, data: error };
    }
  }


    static async callUser(id:string):Promise<FunctionReturnType>{
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
                { "slots.time": { $regex: currentFormattedTime } }
              ]
            }
          }
        ]);
      console.log(bookingData);
      
        
        if(bookingData[0].slots.status === 'Done'){
 
          return {success : false,message:'videocall already done'}
        }
       const sentData =  id === bookingData[0].providedBy? bookingData[0].slots.bookedBy : bookingData[0].providedBy;
       const userId = bookingData[0].slots.bookedBy;
       const bookingId = bookingData[0].bookingId;
       
        if(sentData){
          return {success : true,data:{id:sentData,bookid:bookingId},message:userId}
        }else{
          return {success : false,message:'no booking data'}
        }
        
        
      } catch (error) {
        console.log(error);
        return {success : false,data:error}
        
      }
    }

    static async pushNotification(subscription: ISubscription, id: string): Promise<FunctionReturnType> {
      try {
        if (typeof subscription === 'string') {
          subscription = JSON.parse(subscription);
        }
    
        let subscriptionData = await SubscriptionModel.findOne({ userId: id });
    
        if (!subscriptionData) {
          subscriptionData = await SubscriptionModel.create({
            userId: id,
            subscriptions: subscription
          });
          console.log("New subscription data created:");
        } else {
          console.log("Subscription data found:");
        }
    
        return {success:true}
      } catch (error) {
        console.error("Error in pushNotification:", error);
         return{success:false,data:error}
      }
    }


    static async accountDetails(userid:string):Promise<FunctionReturnType>{
      try {
        const accountDetails = await UserModel.aggregate([
          {
            $match: {
              userId: userid 
            }
          },
          {
            $lookup: {
              from: "professionals",
              localField: "userId",
              foreignField: "userid",
              as: "professionalDetails"
            }
          },
          {
            $unwind: {
              path: "$professionalDetails",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                username: "$username",
                email: "$email",
                isServiceProvider: "$isServiceProvider",
                professionalDetails: {
                  userid: "$professionalDetails.userid",
                  email: "$professionalDetails.email",
                  profession: "$professionalDetails.profession",
                  domain: "$professionalDetails.domain",
                  experience: "$professionalDetails.experience",
                  languages: "$professionalDetails.languages",
                  profilepic: "$professionalDetails.profilepic",
                  description: "$professionalDetails.description",
                  isBlocked: "$professionalDetails.isBlocked",
                  followedByCount: { $size: "$professionalDetails.followedBy" },
                  linkedinUrl: { $ifNull: ["$professionalDetails.linkedinUrl", null] }
                }
              }
            }
          },
        
          {
            $project: {
              _id: 0
            }
          }
                  

        ]);

       
        
        
        if(accountDetails){
          return {success:true,data:accountDetails}
        }else{
          return {success:false,message:'userNot found'}
        }
        
      } catch (error) {
        console.log(error);
        return {success:false,data:error}
      }
    }


    static async editUserInfo(email:string,username:string,userid:string):Promise<FunctionReturnType>{
      try {
       
        const userData = await UserModel.findOne({userId:userid});
        if(userData){
          userData.username = username;
          userData.email = email;
          await userData.save();
          return {success:true,message:'user info changed successfully !!!'}
        }else{
          return {success:false , message:'user not found'}
        }
        
      } catch (error) {
        console.log(error);
        return {success:false,data:error}
        
      }
    }

    static async editUserPassword(
      confirmPassword: string,
      newPassword: string,
      oldPassword: string,
      userid: string
    ): Promise<FunctionReturnType> {
      console.log([confirmPassword,newPassword,oldPassword,userid]);
      
      try {
        const userData = await UserModel.findOne({ userId: userid });
        console.log(userData);
        
        if (!userData) {
          return { success: false, message: "User not found" };
        }
    
        const isMatch = await bcrypt.compare(oldPassword, userData.password);
    
       
        if (!isMatch) {
          return { success: false, message: "Old password does not match" };
        }
    
        
    
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        userData.password = hashedNewPassword;
        await userData.save();
    
        return { success: true, message: "Password updated successfully" };
    
      } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "An error occurred while updating the password" };
      }
    }


    static async fetchReview(userId:string):Promise<FunctionReturnType>{
      try {
        console.log("user id in fetch reviews : ",userId);
        const reviewData = await ReviewModel.findOne({userId:userId},{_id:0,__v:0});
        if(reviewData){
          return {success:true,data:reviewData}
        }
        return {success:false,message:'no review available'}
                
      } catch (error) {
        console.log(error);
        return {success:false,data:error}
      }
    }


    static async addReview(newReview:IReview,userId:string,id:string):Promise<any>{
      try {
        const bookingData = await BookingModel.aggregate([
          { $match: { providedBy: userId } },
          { $unwind: '$slots' },
          { $match: {
            'slots.bookedBy': id,
            'slots.status': 'Done'
          }}
        ]);
       
       
        
        
        if(bookingData.length > 0 ){
         
        const {username,title,date,text} = newReview
        const data = await ReviewModel.findOne({userId: userId});
        if(data){
          data.reviews.push({
            
              reviewerName: username,
              date: date,
              title: title,
              content: text
            
          })
          await data.save()
          return {success : true , message:'Review added successfully'}
        }else{
          const data = await ReviewModel.create({userId: userId,
                 reviews:[
                  {
            
                    reviewerName: username,
                    date: date,
                    title: title,
                    content: text
                  
                }
                 ]
        });
          return {success : true , message:'Review added successfully'}

        }
        }else{
          return {success:false,message:'you cannot add review without attend session !!!'}
        }

        
      } catch (error) {
        console.log(error);
        return {success:false,data:error,message:'error occur while save review'}
        
      }
    }


    static async fetchRating(userId:string):Promise<FunctionReturnType>{
      try {
        const ratingsData= await ProModel.findOne({userid:userId},{_id:0,reviews:1});
        const ratings = ratingsData?.reviews;
        if(ratings){
          console.log("ratings : ",ratings);
          
          return {success:true,data:ratings}
        }else{
          return {success:false,message:'no reviews found !!!'}
        }
        

        
        
      } catch (error) {
        console.log(error);
        return {success:false,data:error,message:'error occur while fetch ratings !!!'}
        
      }
    }
    
    
}