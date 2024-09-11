import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
    owningUser: Number,
    buyerName: String,
    dealStage: String,
    amount: String,
    closeDate: String,
    saleType: String,
    priority: String,
    associatedWith: String,
    saleId: Number
});

const saleModel = new mongoose.model('sales', saleSchema)

export default saleModel;