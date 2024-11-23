const mongoose = require('mongoose');

const donnesSchema = mongoose.Schema({
  temperature: { type: Number, required: true },
  humidite: { type: Number, required: true },
  date: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model('Donne', donnesSchema);
