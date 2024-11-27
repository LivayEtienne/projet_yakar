//Définir le modèle pour l'historique
const HistorySchema = new mongoose.Schema({
  time: String, // Heure du relevé (ex : '10:00')
  temperature: Number, // Température relevée
  humidity: Number, // Humidité relevée
  date: { type: Date, default: new Date().setHours(0, 0, 0, 0) }, // Date du relevé
});

const History = mongoose.model('History', HistorySchema);