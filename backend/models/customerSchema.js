import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    leadStatus: String,
    dateCreated: String,
    jobTitle: String,
    industry: String,
    customerId: Number
})

export default customerSchema;