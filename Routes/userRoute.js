import express from 'express';
import Register from '../Controller/userController.js'
import { GetUser , GetAllUsers, UpdateUser, DeleteUser, login } from '../Controller/userController.js'
import authMiddleware from '../Middleware/authMiddleware.js';



const router = express.Router();



//register Method
router.post('/register', Register);

//register Method
router.post('/login', login);

//Get by ID Method
router.get('/getUser', authMiddleware, GetUser);

//Get all Method
router.get('/getAll', GetAllUsers);


//Update by ID Method
router.put('/updateUser', authMiddleware, UpdateUser);

//Delete by ID Method
router.delete('/deleteUser', authMiddleware,DeleteUser);

export default router;