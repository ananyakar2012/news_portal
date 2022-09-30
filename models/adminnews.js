const mongoose = require('mongoose');  
const newsSchema = new mongoose.Schema({  
    title: {type: String},
    desc: {type: String},
    url: {type: String},
    urltoimage: {type: String},
    date: { type: Date, default: Date.now }
});
mongoose.model('adminnews', newsSchema, 'news_portal');

module.exports = mongoose.model('adminnews');