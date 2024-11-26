// models/Temperature.js
const mongoose = require('mongoose');

const temperatureSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  date: { type: Date, default: Date.now },  // La date à laquelle la température est collectée
});

temperatureSchema.statics.calculateDailyAverage = async function (date) {
  // Calculer la moyenne des températures pour une journée spécifique
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0); // Début de la journée à minuit
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999); // Fin de la journée à 23:59:59

  const temperatures = await this.find({
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  if (temperatures.length === 0) {
    return null; // Pas de données collectées pour ce jour-là
  }

  const sum = temperatures.reduce((acc, temp) => acc + temp.temperature, 0);
  const average = sum / temperatures.length;
  return average;
};

const Temperature = mongoose.model('Temperature', temperatureSchema);

module.exports = Temperature;
