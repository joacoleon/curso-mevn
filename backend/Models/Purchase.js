import mongoose, { Schema } from "mongoose";

const purchaseSchema = new Schema({
    user: { type: Schema.ObjectId, ref: 'user', required: true },
    person: { type: Schema.ObjectId, ref: 'person', required: true },
    receiptType: { type: String, maxlength: 20, required: true },
    receiptSeries: { type: String, maxlength: 7 },
    receiptNumber: { type: String, maxlength: 10, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    details: [{
        _id: { type: String, required: true }, //Lo necesito? Tiene que ser_id?
        item: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },

    }],
    status: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now }
})

const Purchase = mongoose.model('purchase', purchaseSchema);
export default Purchase;