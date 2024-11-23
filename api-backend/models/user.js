const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  telephone: { type: Number, required: true , unique:true },
  code: { type: Number, required: true , unique:true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  archive: { type: Boolean, required: true, default: false } ,
  role: { 
    type: String, 
    enum: ['admin', 'user'],  
    required: true 
  }
  
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);