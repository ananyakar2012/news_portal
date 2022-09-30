const mongoose = require('mongoose');  
const UserSchema = new mongoose.Schema({  
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'normal' },
  date: { type: Date, default: Date.now }
});
mongoose.model('EduUser', UserSchema);

module.exports = mongoose.model('EduUser');