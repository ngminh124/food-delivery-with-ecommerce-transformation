import * as mongoose from 'mongoose';
import { Model } from 'mongoose';

const bannerSchema = new mongoose.Schema({
    banner: {type: String, required: true},
    status: {type: Number, required: true, default: 1},
    created_at: {type: Date, required: true, default: new Date()},
    updated_at: {type: Date, required: true, default: new Date()},
});

export default mongoose.model('banners', bannerSchema)