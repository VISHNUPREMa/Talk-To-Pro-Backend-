import mongoose, { Document, Schema } from 'mongoose';



export interface ITransaction extends Document {
  transactionId: string;
  from: string;
  to: string;
  amount: string;
  time: string;
  date: string;
 
  modeOfPay: 'CreditCard' | 'DebitCard' | 'PayPal' | 'BankTransfer'; // Example payment methods
}



const transactionSchema = new Schema<ITransaction>({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },

  modeOfPay: {
    type: String,
    enum: ['CreditCard', 'DebitCard', 'PayPal', 'BankTransfer'],
    required: true,
  },
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

const TransactionModel = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default TransactionModel;
