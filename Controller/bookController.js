import { config } from 'dotenv';
import bookModel from '../Model/bookModel.js';
import userModel from '../Model/userModel.js';


// Add Multiple Books
const AddMultipleBooks =  async (req, res) => {
    try {
        const books = req.body; // Expecting an array of books
        const userId = req.user.userId;

        if (!Array.isArray(books) || books.length === 0) {
            return res.status(400).json({ message: 'Books array is required and cannot be empty' });
        }

        // Create books and associate them with the user
        const bookDocs = books.map(book => ({ ...book, userId }));
        const savedBooks = await bookModel.insertMany(bookDocs);

        // Update the user with the new books
        const bookIds = savedBooks.map(book => book._id);
        const user = await userModel.findByIdAndUpdate(
            userId,
            { $push: { books: { $each: bookIds } } },
            { new: true }
        ).populate('books', '-userId -__v');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Books for User
const GetUserAllBooks =  async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId).populate('books', '-userId -__v');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Books 
const GetAllBook =  async (req, res) => {
    try {
        const books = await bookModel.find();
        if (!books) {
            return res.status(404).json({ message: 'Books not found' });
        }
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// // Get All Books for User
// const GetAllBook =  async (req, res) => {
//     try {
//         const user = await userModel.findById(req.user.userId).populate('books', '-userId -__v');
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.json(user.books);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const GetBook =  async (req, res) => {
    try {
        const bookId = req.params.id;
        const user = await userModel.findById(req.user.userId).populate({
            path: 'books',
            match: { _id: bookId },
            select: '-userId -__v'
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Book
const UpdateBook =  async (req, res) => {
    try {
        const { title, author } = req.body;
        const updatedData = { title, author, updatedAt: Date.now() };
        const book = await bookModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Book
const DeleteBook =  async (req, res) => {
    try {
        const book = await bookModel.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        // Also remove the book from the user's books array
        await userModel.findByIdAndUpdate(req.user.userId, { $pull: { books: req.params.id } });
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default AddMultipleBooks;
export { GetBook, GetAllBook, UpdateBook, DeleteBook, GetUserAllBooks }
