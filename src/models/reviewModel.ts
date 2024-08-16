import mongoose, { Document, Schema } from 'mongoose';

// Define a nested schema for individual reviews
const individualReviewSchema = new Schema({
  reviewerName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}
, { _id: false });

// Define the main review schema with the nested array
export interface IReview extends Document {
  userId: string;
  reviews: {
    reviewerName: string;
    date: string;
    title: string;
    content: string;
  }[];
}

const reviewSchema = new Schema<IReview>({
  userId: {
    type: String,
    required: true,
  },
  reviews: [individualReviewSchema], // Array of reviews
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

const ReviewModel = mongoose.model<IReview>('Review', reviewSchema);

export default ReviewModel;
