import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    companyName: String,
    email: String,
    password: String
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel