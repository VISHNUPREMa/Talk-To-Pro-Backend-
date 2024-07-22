import express from 'express'
import { userController } from '../controller/userController';



const router = express.Router();
      


router.post('/signup',userController.signupUser.bind(userController));
router.post('/signup/otp',userController.signupUserOtpValidate.bind(userController));
router.post("/login",userController.loginUser.bind(userController));
router.post("/login/googleauth",userController.loginGoogleAuth.bind(userController));
router.post("/forgetpassword/otp",userController.forgetPasswordEmail.bind(userController));
router.post('/forgetpassword/verifyotp',userController.forgetPasswordOtp.bind(userController));
router.post('/forgetpassword/resetpassword',userController.resetPassword.bind(userController))
router.get('/cards', userController.getCards.bind(userController));  
router.post('/getavailableslot',userController.getAvailableSlots.bind(userController));
router.patch('/bookslot',userController.bookSlot.bind(userController));
router.post('/userbooking',userController.userBookings.bind(userController));
router.post('/transaction',userController.userTransactions.bind(userController))                                  


export default router