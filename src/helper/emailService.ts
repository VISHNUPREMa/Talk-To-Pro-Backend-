import nodemailer from 'nodemailer';

const sendEmailOtp = async (email: string, otp: number | string ) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: 'Your OTP for verification',
      text: `Your OTP is: ${otp}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP sent to mail:', info.response);
  } catch (error) {
    console.error('Failed to send the mail', error);
  }
};

export default sendEmailOtp;
