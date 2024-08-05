import mongoose, { Document, Schema } from 'mongoose';



export interface IUser extends Document {
    username: string;
    userId: string;
    email: string;
    password: string;
    isAdmin: boolean;
    isServiceProvider: boolean;
    isVerified: boolean;
    isBlocked: boolean;
    createdAt: Date;
   
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isServiceProvider: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now  
    },
  
});

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;

