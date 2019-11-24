import * as mongoose from 'mongoose';
/**
 * This ts file must contain all the schemas used in this module.
 */
export const PageSchema = new mongoose.Schema({
    pageUrl: String,
    content: String,
    contentDescription: String,
    lastPreRenderingDate: Number,
});
