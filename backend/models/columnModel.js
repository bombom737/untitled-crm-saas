import mongoose from 'mongoose';

const columnSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true }
});

const columnsArraySchema = new mongoose.Schema({
    owningUser: { type: Number, required: true },
    columns: [columnSchema] 
});

const ColumnModel = mongoose.model('columns', columnsArraySchema);

export default ColumnModel;