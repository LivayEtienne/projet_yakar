// models/Parametre.js
import mongoose from 'mongoose';

const parametreSchema = new mongoose.Schema({
  etatVentilateur: { type: Boolean, default: false },
  etatBuzzer: { type: Boolean, default: false },
  temperatureMax: { type: Number, required: true }
});

// Exporter le modèle
export default mongoose.model('Parametre', parametreSchema);