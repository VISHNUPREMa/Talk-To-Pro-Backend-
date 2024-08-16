import express from 'express';
import { adminController } from '../controller/adminController';


const router = express.Router();

router.post("/admin/login",adminController.adminLogin.bind(adminController));
router.get('/allusers',adminController.getAllUsers.bind(adminController));
router.post('/blockuser',adminController.blockUser.bind(adminController));
router.post('/unblockuser',adminController.unblockUser.bind(adminController))
router.get('/allpro',adminController.getAllpro.bind(adminController));
router.post('/blockpro',adminController.blockpro.bind(adminController));
router.post('/unblockpro',adminController.unblockpro.bind(adminController));
router.get('/allbooking',adminController.getAllbooking.bind(adminController));
router.get('/allprorequset',adminController.getAllProRequests.bind(adminController));
router.get('/alltransaction',adminController.getAlltransaction.bind(adminController));
router.put('/admin/verifytoken',adminController.verifyToken.bind(adminController));
router.patch('/verifyprorequest',adminController.verifyProRequest.bind(adminController));
router.get('/piechart',adminController.getPIeChartData.bind(adminController));
router.get('/getbarchart',adminController.getBarChartData.bind(adminController))


export default router;