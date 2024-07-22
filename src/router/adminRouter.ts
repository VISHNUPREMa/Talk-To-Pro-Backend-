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


export default router;