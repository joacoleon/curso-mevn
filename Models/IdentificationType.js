import mongoose, {Schema} from "mongoose";

const identificationTypeSchema = new Schema({
    identificationTypeCode: {type: String, maxlength: 2, unique: true, required: true},
    identificationTypeDescription: {type: String, maxlength: 255, unique: true, required: true},
    status: {type: Number, default: 1},
    createdAt: {type: Date, default: Date.now}
});

const IdentificationType = mongoose.model('identificationType', identificationTypeSchema);

export default IdentificationType;