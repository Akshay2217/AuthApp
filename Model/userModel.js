import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
},
{ timestamps: true }
);

 const userModel = mongoose.model('User', userSchema)

 export default userModel;
