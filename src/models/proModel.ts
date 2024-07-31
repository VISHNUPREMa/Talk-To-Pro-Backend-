import mongoose, { Document, Schema } from 'mongoose';

export interface Ipro extends Document {
    userid: string;
    email?: string;
    profession: string;
    domain: Array<string>;
    experience: string;
    languages: Array<string>;
    profilepic: string;
    description: string;
    isBlocked: boolean;
    followedBy:string[]
}


const ProfessionalSchema: Schema = new Schema<Ipro>({
    userid: { type: String, required: true },
    email: { type: String, required: false },
    profession: { type: String, required: true },
    domain: { type: [String], required: false },
    experience: { type: String, required: true },
    languages: { type: [String], required: true },
    profilepic: { type: String, required: true },
    description: { type: String, required: true },
    isBlocked: { type: Boolean, required: true },
    followedBy: { type: [String], default: [] },
});

const ProModel =  mongoose.model<Ipro>('Professional', ProfessionalSchema);
export default ProModel