import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    owningUser: Number,
    name: String,
    email: String,
    phoneNumber: String,
    leadStatus: String,
    dateCreated: String,
    jobTitle: String,
    industry: String,
    customerId: Number
});

const customerModel = new mongoose.model('customers', customerSchema)

export default customerModel;
