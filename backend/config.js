import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://tootoopaz:21002100TgHy@cluster0.gofgudu.mongodb.net/',
).then(() => {
    console.log("Database connected successfully");
}).catch((error) => {
    console.error("Couldn't connect to database", error);
});

const userSchema = new mongoose.Schema({
    fullName: String,
    companyName: String,
    email: String,
    password: String
});

const UserModel = mongoose.model('User', userSchema);

export default {
    mongoose,
    UserModel
};
