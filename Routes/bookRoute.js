import express from 'express';
import authMiddleware from '../Middleware/authMiddleware.js';
import AddMultipleBooks, { DeleteBook, GetAllBook, GetBook, GetUserAllBooks, UpdateBook } from '../Controller/bookController.js';



const router = express.Router();

router.post('/addBooks', authMiddleware, AddMultipleBooks)




router.put('/book/:id', authMiddleware, UpdateBook);

//Get one Method
router.get('/getBook/:id', authMiddleware, GetBook);


//Get one user Method
router.get('/getBook/:id', GetBook);

//Get all Method
router.get('/userBooks', authMiddleware, GetUserAllBooks);


//Get all Method
router.get('/books', GetAllBook);

//Delete Method
router.get('/book/:id', authMiddleware, DeleteBook);




// //Update by ID Method
// router.put('/update', authMiddleware, UpdateUser);

// //Delete by ID Method
// router.delete('/delete/:id', DeleteUser);

export default router;