import UserModel, { IUser } from '../models/userModel';
import ProModel from '../models/proModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AdminRepository {
    static async validateLogin(data: { email: string; password: string }): Promise<{ success: boolean; message: string;token?:string }> {
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


    static async getAllUsers():Promise<any>{
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

        return usersWithProfilePics
        

    }



    static async blockUser(email: string): Promise<{ success: boolean; message: string }> {
        try {
           

            // Find the user by email
            const user = await UserModel.findOne({ email });
            console.log("User:", user);

            if (user) {
                // Update the user's isBlocked status
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
            return { success: false, message: 'Error blocking user.' };
        }
    }



    static async unblockUser(email: string): Promise<{ success: boolean; message: string }> {
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
            return { success: false, message: 'Error unblocking user.' };
        }
    }


    static async getAllpro():Promise<any>{
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
        return professionalsWithUsernames
    
    }



    static async blockpro(id: string): Promise<{ success: boolean; message: string }> {
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


    static async unblockpro(id: string): Promise<{ success: boolean; message: string }> {
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
    
}   
