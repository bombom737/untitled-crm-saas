import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
    dealName: { type: String, required: true },
    dealStage: { type: String, required: true },
    amount: { type: Number, required: true },
    closeDate:  String,
    saleType: String, 
    priority: String, 
    associatedWith: String, 
    saleId: { type: Number, required: true }
});

const saleCardSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    columnId: { type: Number, required: true },
    sale: saleSchema
})

const saleCardArraySchema = new mongoose.Schema({
    owningUser: { type: Number, required: true },
    saleCards: [saleCardSchema]
})

const saleModel = mongoose.model('sales', saleCardArraySchema)

export default saleModel;