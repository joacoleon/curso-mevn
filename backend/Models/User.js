import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    role: {type: Schema.ObjectId, ref: 'userType'},
    name: {type: String, maxlength: 50, unique: true, required: true},
    id_type: {type: Schema.ObjectId, ref: 'identificationType'},
    id_number: {type: String, maxlength: 20},
    address: {type: String, maxlength: 70},
    phone: {type: String, maxlength: 20},
    email: {type: String, maxlength: 50, unique: true, required: true},
    password: {type: String, maxlength: 64, required: true},
    isActive: {type: Boolean, default: true},
    hasDefaultPassword: {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now}
});

const User = mongoose.model('user', userSchema);
export default User;