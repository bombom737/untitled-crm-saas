import mongoose from 'mongoose';

const columnSchema = new mongoose.Schema({
    owningUser: Number,
    id: Number,
    title: String
});

const columnModel = new mongoose.model('columns', columnSchema)

export default columnModel;