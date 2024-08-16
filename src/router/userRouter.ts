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
router.post('/bookslot',userController.bookSlot.bind(userController));
router.post('/userbooking',userController.userBookings.bind(userController));
router.post('/transaction',userController.userTransactions.bind(userController));
router.post('/verifytoken',userController.verifyToken.bind(userController));
router.post('/notification',userController.userNotification.bind(userController));
router.post('/call',userController.callUser.bind(userController));
router.post('/storePushNotification',userController.pushNotification.bind(userController));
router.post('/accountdetails',userController.accountDetails.bind(userController));
router.patch('/edituserdetails',userController.editUserInfo.bind(userController))          
router.patch('/editpassword',userController.editUserPassword.bind(userController));
router.post('/fetchreview',userController.fetchReview.bind(userController));
router.post('/addreview',userController.addReview.bind(userController));
router.post('/fetchratings',userController.fetchRating.bind(userController))
                                    


export default router