import mongoose from 'mongoose';
import customerSchema from './customerModel.js';
import saleSchema from './saleModel.js';

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    companyName: String,
    email: String,
    password: String,
    id: Number,
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel