import mongoose, { Document, Schema } from 'mongoose';

// Define the structure of a wallet detail entry
interface IWalletDetail {
    from: string;
    amount: string;
    status:string
}

// Define the structure of the Wallet document
export interface IWallet extends Document {
    walletId: string;
    walletBy: string;
    walletDetails: IWalletDetail[];
    totalAmount:number
}

// Create the Wallet schema
const WalletSchema: Schema = new Schema<IWallet>({
    walletId: { type: String, required: true },
    walletBy: { type: String, required: true },
    walletDetails: [
        {
            from: { type: String, required: true },
            amount: { type: String, required: true },
            status:{type:String,require:false},
            _id: false 
        }
    ],
    totalAmount:{ type: Number, required: false }
});

// Create the Wallet model
const WalletModel = mongoose.model<IWallet>('Wallet', WalletSchema);

export default WalletModel;
