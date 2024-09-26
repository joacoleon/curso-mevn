import mongoose, {Schema} from "mongoose";

const userTypeSchema = new Schema({
    userTypeCode: {type: String, maxlength: 2, unique: true, required: true},
    userTypeDescription: {type: String, maxlength: 255, unique: true, required: true},
    status: {type: Number, default: 1},
    createdAt: {type: Date, default: Date.now}
});

const UserType = mongoose.model('userType', userTypeSchema);

export default UserType;