
import express from 'express';

import {changeUserRole} from '../controllers/authController.js';
import { authenticateUser } from '../middlewares/authmiddleware.js';


const router = express.Router();




router.patch('/change-role', authenticateUser,changeUserRole); 

export default router;