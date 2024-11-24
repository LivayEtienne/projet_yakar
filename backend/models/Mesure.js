// models/Mesure.js
import mongoose from 'mongoose';

const mesureSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  humidite: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

// Exporter le modèle
export default mongoose.model('Mesure', mesureSchema);