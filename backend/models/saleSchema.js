import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
    buyerName: String,
    dealStage: String,
    amount: String,
    closeDate: String,
    saleType: String,
    priority: String,
    associatedWith: String,
    saleId: Number
})

export default saleSchema;