import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    id: { type: Number, required: true }
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel