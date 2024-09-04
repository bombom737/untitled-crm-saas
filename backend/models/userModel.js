import mongoose from 'mongoose';
import customerSchema from './customerSchema.js';
import saleSchema from './saleSchema.js';

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    companyName: String,
    email: String,
    password: String,
    id: Number,
    customersArray: [customerSchema],
    salesArray: [saleSchema]
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel