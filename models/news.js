import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const newsSchema = new Schema({
    title: {type: String},
    desc: {type: String},
    url: {type: String},
    urltoimage: {type: String},
    date: { type: Date, default: Date.now }
});

export default mongoose.model('news', newsSchema, 'news_portal');