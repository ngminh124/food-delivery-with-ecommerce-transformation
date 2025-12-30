import * as mongoose from 'mongoose';
import { Model } from 'mongoose';

const categorySchema = new mongoose.Schema({
    user_id: {type: mongoose.Types.ObjectId, required: true},
    name: {type: String, required: true},
    created_at: {type: Date, required: true, default: new Date()},
    updated_at: {type: Date, required: true, default: new Date()},
    // cuisine: [{type: mongoose.Types.ObjectId, ref: 'cuisine'}], 
});

export default mongoose.model('categories', categorySchema)