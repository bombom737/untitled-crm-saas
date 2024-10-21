import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    leadStatus: { type: String, required: true },
    dateCreated: { type: String, required: true },
    jobTitle: { type: String, required: true },
    industry: { type: String, required: true },
    customerId: { type: Number, required: true }
});

const customerArraySchema = new mongoose.Schema({
    owningUser: { type: Number, required: true },
    customers: [customerSchema]
})

const customerModel = mongoose.model('customers', customerArraySchema)

export default customerModel;
