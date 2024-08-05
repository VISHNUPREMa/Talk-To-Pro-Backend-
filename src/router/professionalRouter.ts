import express from 'express';
import { proController } from '../controller/proController';
import multer from 'multer'
import path from 'path';

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {

      cb(null, path.join(__dirname, '../../public'));
    },
    filename: (req, file, cb) => {
       
        
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const upload = multer({ storage });
     
router.post("/professional/register", upload.single('profilePic'),proController.proRegister.bind(proController));
router.post('/saveAvailableSlots',proController.saveAvailableSlots.bind(proController));
router.post('/bookedslot',proController.getAllocatedSlot.bind(proController));
router.post('/iscalled',proController.isUserCalled.bind(proController));
router.patch('/follow',proController.followPro.bind(proController));
router.patch('/unfollow',proController.unFollowPro.bind(proController))

export default router;
