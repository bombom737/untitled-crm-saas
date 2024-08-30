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

const SaleModel = mongoose.model('Sale', saleSchema);

export default SaleModel;