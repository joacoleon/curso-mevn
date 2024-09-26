import mongoose, {Schema} from "mongoose";

const personTypeSchema = new Schema({
    personTypeCode: {type: String, maxlength: 2, unique: true, required: true},
    personTypeDescription: {type: String, maxlength: 255, unique: true, required: true},
    status: {type: Number, default: 1},
    createdAt: {type: Date, default: Date.now}
});

const PersonType = mongoose.model('personType', personTypeSchema);

export default PersonType;