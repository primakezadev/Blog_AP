import express from 'express';
import userRoutes from './userroutes';
import authroutes from './authroutes';
import blogroutes from './blogroutes'

const router = express.Router();

router.use('/users', userRoutes);
router.use('/blog', blogroutes);
router.use('/auth', authroutes )
export default router;