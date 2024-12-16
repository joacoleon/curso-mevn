import mongoose, {Schema} from "mongoose";

const categorySchema = new Schema({
    name: {type: String, maxlength: 50, unique: true, required: true},
    description: {type: String, maxlength: 255},
    isActive: {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now}
});

const Category = mongoose.model('category', categorySchema);

export default Category;