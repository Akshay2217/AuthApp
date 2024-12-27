import userModel from '../Model/userModel.js'
import bookModel from '../Model/bookModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;


        if (!firstName || firstName.trim() === '') {
            return res.status(400).json({
                message: "First name is required",
            });
        }
        if (!lastName || lastName.trim() === '') {
            return res.status(400).json({
                message: "First name is required",
            });
        }
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }
        if (!password) {
            return res.status(400).json({
                message: "Password is required",
            });
        }

        //Verifying the email address inputed is not used already 
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(403).json({
                message: "Email already used",
            });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);


        const data = new userModel({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })
        const dataToSave = await data.save();
        res.status(200).json({ message: 'user added successfully', dataToSave })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }

}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation    
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }
        if (!password) {
            return res.status(400).json({
                message: "Password is required",
            });
        }

        // Verify if the email is registered
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: existingUser._id},
            process.env.JWT_SECRET, // Use a secure key for production
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'User login successful',
            token,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }

}



const GetUser = async (req, res) => {
    // console.log("user Id:  ", req.body.userId);
    const id = req.user.userId;
    console.log("user id::",id)
    try {
        console.log(id)
        const data = await userModel.findById(id).select("-password").populate('books', '-userId -__v');;
        console.log("user data:  ", data);
        if (!data) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const GetAllUsers = async (req, res) => {

    try {
        const data = await userModel.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const UpdateUser = async(req, res) => {
    try {
        const id  = req.user.userId;
        const { firstName, lastName, email, password } = req.body;
        console.log("req.body", firstName, lastName, email, password);

        // Validate the provided ID
        // if (!ObjectId.isValid(id)) {
        //     return res.status(400).json({ message: 'Invalid user ID format' });
        // }

        // Validate required fields
        // if (!firstName || !lastName || !email || !password) {
        //     return res.status(400).json({ message: 'All fields are required' });
        // }

        const options = { new: true };

        console.log('Updating user:', id);

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const updatedData = {
            firstName,
            lastName,
            email,
            password: hashedPassword
        };

        console.log('Updating user:', id, updatedData);

        const result = await userModel.findByIdAndUpdate(id, updatedData, options);
        console.log("result: ", result);

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const DeleteUser = async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await bookModel.deleteMany({ userId: req.user.userId }); // Delete all books associated with the user
        res.json({ message: 'User and associated books deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }


}

export default Register;
export { GetUser, GetAllUsers, UpdateUser, DeleteUser, login }