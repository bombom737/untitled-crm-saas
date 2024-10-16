import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
    dealName: String,
    dealStage: String,
    amount: String,
    closeDate: String,
    saleType: String,
    priority: String,
    associatedWith: String,
    saleId: Number
});

const saleCardSchema = new mongoose.Schema({
    owningUser: Number,
    id: Number,
    columnId: Number,
    sale: saleSchema
})

const saleModel = new mongoose.model('sales', saleCardSchema)

export default saleModel;