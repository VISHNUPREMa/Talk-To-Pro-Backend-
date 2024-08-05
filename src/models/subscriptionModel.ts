import { Schema, model, Document } from 'mongoose';

export interface ISubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface IUserSubscription extends Document {
  userId: string;
  subscriptions: ISubscription;
}

const SubscriptionSchema = new Schema<ISubscription>({
  endpoint: { type: String, required: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
}, { _id: false }); 

const UserSubscriptionSchema = new Schema<IUserSubscription>({
  userId: { type: String, required: true },
  subscriptions: { type: SubscriptionSchema, required: true },
});

const SubscriptionModel = model<IUserSubscription>('UserSubscription', UserSubscriptionSchema);

export default SubscriptionModel;
