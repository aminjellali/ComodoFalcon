import * as mongoose from 'mongoose';

export const PageSchema = new mongoose.Schema({
    pageUrl: String,
    content: String,
    contentDescription: String,
    lastPreRenderingDate: Number,
});
