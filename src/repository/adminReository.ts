import UserModel, { IUser } from '../models/userModel';
import ProModel from '../models/proModel';
import BookingModel from '../models/bookingModel';
import TransactionModel from '../models/transactionModel' 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { format } from 'date-fns'
import { FunctionReturnType } from '../helper/reusable';

export class AdminRepository {
    static async validateLogin(data: { email: string; password: string }): Promise<FunctionReturnType> {
        const { email, password } = data;
        
        try {
            const user = await UserModel.findOne({ email:email },{_id:0});
            
            if (user && user.isAdmin) {
                console.log("user  : ",user);
                
                const isValidPassword = await bcrypt.compare(password, user.password);
                
                if (isValidPassword) {
                    const token = jwt.sign({ id: user.userId, email: user.email }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });
                    return { success: true,token, message: 'Login successful' };
                } else {
                    return { success: false, message: 'Invalid Password' };
                }
            } else {
                return { success: false, message: 'Invalid Admin credentials' };
            }
        } catch (error) {
            console.error('Error during login validation:', error);
            return { success: false, message: 'An error occurred during login' };
        }
    }


    static async getAllUsers():Promise<FunctionReturnType>{
try {
    const allUsers = await UserModel.find({},{_id:0,userId:1,username:1,createdAt:1,isBlocked:1,email:1});
     
    const usersWithProfilePics = await Promise.all(allUsers.map(async (user) => {
        const profile = await ProModel.findOne({ userid: user.userId }, { _id: 0, profilepic: 1 });

    
        const formattedCreatedAt = new Date(user.createdAt).toISOString().split('T')[0];

        return {
            userId: user.userId,
            username: user.username,
            createdAt: formattedCreatedAt,
            isBlocked: user.isBlocked,
            email: user.email,
            profilePic: profile ? profile.profilepic : null
        };
    }));

    return {success:true,data:usersWithProfilePics}
} catch (error) {
    console.log(error);
    return {success:false,data:error}
}
        

    }



    static async blockUser(email: string): Promise<FunctionReturnType> {
        try {
        
            const user = await UserModel.findOne({ email });
            console.log("User:", user);

            if (user) {
           
                user.isBlocked = true;
                await user.save();

                console.log(`User with email ${user.username} has been blocked.`);
                return { success: true, message: `user account of ${user.username} has been blocked.` };
            } else {
                console.log(`User with email ${email} not found.`);
                return { success: false, message: `User with email ${email} not found.` };
            }
            
        } catch (error) {
            console.error('Error blocking user:', error);
            return { success: false, message: 'Error blocking user.',data:error };
        }
    }



    static async unblockUser(email: string): Promise<FunctionReturnType> {
        try {
          
            const user = await UserModel.findOne({ email });
            console.log("User:", user);
    
            if (user) {
                
                user.isBlocked = false;
                await user.save();
    
                console.log(`User with email ${user.username} has been unblocked.`);
                return { success: true, message: `User with email ${user.username} has been unblocked.` };
            } else {
                console.log(`User with email ${email} not found.`);
                return { success: false, message: `User with email ${email} not found.` };
            }
        } catch (error) {
            console.error('Error unblocking user:', error);
            return { success: false, message: 'Error unblocking user.',data:error };
        }
    }


    static async getAllpro():Promise<FunctionReturnType>{
   try {
    const allpro = await ProModel.find({},{_id:0,userid:1,email:1,profession:1,profilepic:1,isBlocked:1});
    const professionalsWithUsernames = await Promise.all(allpro.map(async (pro) => {
        const user = await UserModel.findOne({ userId: pro.userid }, { _id: 0, username: 1 });
        return {
           userid:pro.userid,
            username: user ? user.username : null,
            email: pro.email,
            profession: pro.profession,
            profilePic: pro.profilepic,
            isBlocked:pro.isBlocked

        };
    }));

    console.log("Professionals with usernames:", professionalsWithUsernames);
    return {success:true , data:professionalsWithUsernames}
    
   } catch (error) {
    return {success:false , data:error}
   }
    
    }



    static async blockpro(id: string): Promise<FunctionReturnType> {
        try {
           
            const pro = await ProModel.findOne({ userid:id });
            console.log("User:", pro);

            if (pro) {
               
                pro.isBlocked = true;
                await pro.save();

                console.log(`User with email ${pro.email} has been blocked.`);
                return { success: true, message: `user account of ${pro.email} has been blocked.` };
            } else {
                console.log(`User with email ${id} not found.`);
                return { success: false, message: `User with email ${id} not found.` };
            }
            
        } catch (error) {
            console.error('Error blocking user:', error);
            return { success: false, message: 'Error blocking user.' };
        }
    }


    static async unblockpro(id: string): Promise<FunctionReturnType> {
        try {
           
            const pro = await ProModel.findOne({ userid:id });
            console.log("User:", pro);

            if (pro) {
               
                pro.isBlocked = false;
                await pro.save();

                console.log(`User with email ${pro.email} has been unblocked.`);
                return { success: true, message: `user account of ${pro.email} has been unblocked.` };
            } else {
                console.log(`User with email ${id} not found.`);
                return { success: false, message: `User with email ${id} not found.` };
            }
            
        } catch (error) {
            console.error('Error blocking user:', error);
            return { success: false, message: 'Error blocking user.' };
        }
    }
    

    static async getAllbooking(): Promise<FunctionReturnType> {
        try {
            const allBookings = await BookingModel.aggregate([
                {
                  $project: {
                    _id: 0,
                    bookingId: 1,
                    providedBy: 1,
                    date: 1,
                    slots: 1,
                    amount:1
                  }
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "providedBy",
                    foreignField: "userId",
                    as: "providerDetails"
                  }
                },
                {
                  $unwind: {
                    path: "$providerDetails",
                    preserveNullAndEmptyArrays: true
                  }
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "slots.bookedBy",
                    foreignField: "userId",
                    as: "userDetails"
                  }
                },
                {
                  $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true
                  }
                },
                {
                  $addFields: {
                    "slots.bookedBy": "$userDetails.username",
                    "providedBy": "$providerDetails.username"
                  }
                },
                {
                  $unwind: "$slots" 
                },
                {
                  $project: {
                    _id: 0,
                    bookingId: 1,
                    providedBy: 1,
                    date: 1,
                    time: "$slots.time",
                    status: "$slots.status",
                    bookedBy: "$slots.bookedBy",
                    amount:1
                  }
                }
              ]);
              
              
              
return {success:true,data:allBookings}              



        } catch (error) {
          console.log(error);
          return {success:false,data:error}
        }
      }


      static async getAlltransaction():Promise<FunctionReturnType>{
        try {
            const allTransactions = await TransactionModel.aggregate([
                {
                    $project: {
                        _id: 0,
                        __v: 0,
                        transactionId: 0
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "from",
                        foreignField: "userId",
                        as: "fromBy"
                    }
                },
                {
                    $addFields: {
                        fromBy: {
                            $arrayElemAt: ["$fromBy.username", 0]
                        }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "to",
                        foreignField: "userId",
                        as: "toBy"
                    }
                },
                {
                    $addFields: {
                        toBy: {
                            $arrayElemAt: ["$toBy.username", 0]
                        }
                    }
                }
            ]);
            
          
            const formattedTransactions = allTransactions.map(transaction => ({
                amount: transaction.amount,
                time: transaction.time,
                date: transaction.date,
                modeOfPay: transaction.modeOfPay,
                updatedAt: format(new Date(transaction.updatedAt), 'yyyy-MM-dd HH:mm:ss'),
                fromBy: transaction.fromBy,
                toBy: transaction.toBy
            }));
            
     
            return {success:true,data:formattedTransactions}
            
            
        } catch (error) {
            console.log(error);
            return {success:true,data:error}
        }
      }
}   
