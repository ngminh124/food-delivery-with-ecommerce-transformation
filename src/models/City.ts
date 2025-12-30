import * as mongoose from 'mongoose';
import { Model } from 'mongoose';

const citySchema = new mongoose.Schema({
    name: {type: String, required: true},
    lat:{type: Number, required: true},
    lng:{type: Number, required: true},
    status: {type: String, required: true, default: 'active'},
    created_at: {type: Date, required: true, default: new Date()},
    updated_at: {type: Date, required: true, default: new Date()},
});

export default mongoose.model('cities', citySchema)