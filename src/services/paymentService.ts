import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();


export class PaymentService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });
  } 

  async createOrder(amount: number, currency: string = 'INR') {
    const options = {
      amount: amount * 100, 
      currency,
    };
    const order = await this.razorpay.orders.create(options);
    return order;
  }

  verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string);
    hmac.update(orderId + '|' + paymentId);
    const generatedSignature = hmac.digest('hex');
    return generatedSignature === signature;
  }
}
