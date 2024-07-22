import mongoose, { Document, Schema } from 'mongoose';

export interface Slot {
  time: string;
  status: string;
  bookedBy?: string;
}

export interface IBooking extends Document {
  bookingId: string;
  
  providedBy: string;
  date: string;
  slots: Slot[];
  bookingFee?: number;
  createdAt: Date;
  updatedAt: Date;
  amount:string
}

const slotSchema = new Schema<Slot>({
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Done', 'Booked'],
    default: 'Pending',
  },
  bookedBy: {
    type: String,
  },
}, { _id: false });  
  

const bookingSchema = new Schema<IBooking>({
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },
 
  providedBy: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  slots: {
    type: [slotSchema],
    required: true,
  },
  bookingFee: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  amount:{
    type:String,
  }
});

const BookingModel = mongoose.model<IBooking>('Booking', bookingSchema);

export default BookingModel;
