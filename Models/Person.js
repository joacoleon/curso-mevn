import mongoose, {Schema} from "mongoose";

const personSchema = new Schema({
    person_type: {type: Schema.ObjectId, ref: 'personType'},
    name: {type: String, maxlength: 50, unique: true, required: true},
    id_type: {type: Schema.ObjectId, ref: 'identificationType'},
    id_number: {type: String, maxlength: 20},
    address: {type: String, maxlength: 70},
    phone: {type: String, maxlength: 20},
    email: {type: String, maxlength: 50, unique: true},
    status: {type: Number, default: 1},
    createdAt: {type: Date, default: Date.now}
});

const Person = mongoose.model('person', personSchema);
export default Person;