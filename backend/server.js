import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { SerialPort, ReadlineParser } from 'serialport';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io'; // Import Socket.IO
import http from 'http'; // Nécessaire pour utiliser Socket.IO avec Express
import cron from 'node-cron'; // Importation de node-cron

dotenv.config();

const app = express();
const server = http.createServer(app); // Création d'un serveur HTTP
const io = new SocketIOServer(server); // Initialisation de Socket.IO avec le serveur HTTP
const PORT = process.env.PORT || 3001;
const MONGO_URI = 'mongodb://localhost:27017/gestionTempHumid';
const SERIAL_PORT = '/dev/ttyACM0'; // Remplacez par votre port Arduino

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.error('Erreur MongoDB:', err));

// Modèle de données pour les relevés
const mesureSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});
const MesureModel = mongoose.model('Mesure', mesureSchema);

// Variable pour stocker les données actuelles en temps réel
let currentData = {
  temperature: null,
  humidity: null,
  timestamp: null,
};

// Fonction pour simuler les données des capteurs (en attendant des données réelles)
function getSensorData() {
  return {
    temperature: Math.floor(Math.random() * 10) + 20, // Simule une température entre 20°C et 30°C
    humidity: Math.floor(Math.random() * 20) + 40,   // Simule une humidité entre 40% et 60%
    timestamp: new Date(),
  };
}

// Fonction pour enregistrer les données dans la base de données
async function saveData() {
  if (currentData.temperature !== null && currentData.humidity !== null) {
    const mesure = new MesureModel({
      temperature: currentData.temperature,
      humidity: currentData.humidity,
    });

    try {
      await mesure.save();
      console.log('Données enregistrées à', currentData.timestamp);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement des données:', err.message);
    }
  }
} 

cron.schedule('0,1,2 18 * * *', () => {
  console.log('Enregistrement des données à', new Date());
  saveData(); // Fonction que vous avez déjà pour enregistrer les mesures
});


app.get('/api/mesures/specific-times', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Début du jour actuel

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Début du jour suivant

    const mesures = await MesureModel.find({
      timestamp: { $gte: today, $lt: tomorrow },
    }).sort({ timestamp: 1 });

    // Filtrer les mesures pour obtenir celles à 18h00, 18h01 et 18h02
    const fixedTimes = [
      { hour: 18, minute: 0 },
      { hour: 18, minute: 1 },
      { hour: 18, minute: 2 },
    ];

    const filteredMesures = fixedTimes.map(time => {
      return mesures.find(mesure => {
        const mesureDate = new Date(mesure.timestamp);
        return (
          mesureDate.getHours() === time.hour &&
          mesureDate.getMinutes() === time.minute
        );
      });
    }).filter(Boolean); // Retirer les valeurs `undefined` si aucune mesure n'existe pour une heure donnée

    const response = filteredMesures.map(mesure => ({
      temperature: mesure.temperature,
      humidity: mesure.humidity,
      timestamp: mesure.timestamp,
    }));

    res.json({
      message: 'Mesures récupérées avec succès',
      data: response,
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des données:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});


// Route pour obtenir l'historique des mesures de la semaine
app.get('/api/historique/hebdomadaire', async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Commence le lundi

    const mesures = await MesureModel.find({
      timestamp: { $gte: startOfWeek }
    }).sort({ timestamp: 1 }); // Tri croissant par date

    const response = mesures.map(mesure => ({
      date: mesure.timestamp.toLocaleDateString('fr-FR', { weekday: 'long' }), // Récupère le jour de la semaine
      temperature: mesure.temperature,
      humidity: mesure.humidity,
    }));

    res.json({
      message: 'Historique des mesures récupéré avec succès',
      data: response,
    });
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'historique des mesures:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});
// Obtenir l'humidité en temps réel
app.get('/api/real-time/humidity', (req, res) => {
  if (currentData.humidity !== null) {
    console.log(`Humidité en temps réel : ${currentData.humidity}% à ${currentData.timestamp}`);
    res.json({ humidity: currentData.humidity, timestamp: currentData.timestamp });
  } else {
    res.status(404).json({ message: 'Aucune donnée d\'humidité disponible.' });
  }
});
// Obtenir la température en temps réel
app.get('/api/real-time/temperature', (req, res) => {
  if (currentData.temperature !== null) {
    console.log(`Température en temps réel : ${currentData.temperature}°C à ${currentData.timestamp}`);
    res.json({ temperature: currentData.temperature, timestamp: currentData.timestamp });
  } else {
    res.status(404).json({ message: 'Aucune donnée de température disponible.' });
  }
});
// Route pour obtenir la température et l'humidité moyennes de la journée
app.get('/api/moyennes/jour', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const mesures = await MesureModel.find({
      timestamp: { $gte: startOfDay, $lte: endOfDay }
    });

    if (mesures.length === 0) {
      return res.json({
        message: 'Aucune mesure disponible pour aujourd\'hui.',
        averageTemperature: null,
        averageHumidity: null,
      });
    }

    const totalTemperature = mesures.reduce((sum, mesure) => sum + mesure.temperature, 0);
    const totalHumidity = mesures.reduce((sum, mesure) => sum + mesure.humidity, 0);

    const averageTemperature = totalTemperature / mesures.length;
    const averageHumidity = totalHumidity / mesures.length;

    res.json({
      message: 'Moyennes calculées avec succès',
      averageTemperature: averageTemperature,
      averageHumidity: averageHumidity,
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des moyennes de la journée:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});
// Configuration du port série
const port = new SerialPort({ path: SERIAL_PORT, baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// WebSocket : connexion avec les clients
io.on('connection', (socket) => {
  console.log('Client connecté :', socket.id);
  
  socket.on('toggleFan', (status) => {
    
});

// Variables d'état
let fanState = false;

app.post('/api/fan/control', (req, res) => {
  // Utilisation de `state` sans l'extraire de `req.body`
  console.log(`Commande reçue pour le ventilateur : ${state ? 'ON' : 'OFF'}`);
});


app.post('/api/fan/control', (req, res) => {
  const { state } = req.body; // Extraction de `state` depuis le corps de la requête

  if (typeof state === 'boolean') {
    console.log(`Commande reçue pour le ventilateur : ${state ? 'ON' : 'OFF'}`);
    fanState = state; // Mettre à jour l'état global du ventilateur
    res.sendStatus(200); // Réponse au client
  } else {
    console.error('Erreur : valeur de state invalide');
    res.status(400).json({ error: 'Valeur de state invalide' });
  }
});


// Envoi immédiat des données actuelles au client nouvellement connecté
  if (currentData.temperature !== null && currentData.humidity !== null) {
    socket.emit('update', currentData);
  }

  socket.on('disconnect', () => {
    console.log('Client déconnecté :', socket.id);
  });
});

// Lecture des données Arduino
parser.on('data', async (data) => {
  try {
    const parsed = JSON.parse(data); // Assurez-vous que l'Arduino envoie des données au format JSON
    // Mise à jour des données en temps réel
    currentData = {
      temperature: parsed.temperature,
      humidity: parsed.humidity,
      timestamp: new Date(),
    };

    // Diffusion des données en temps réel à tous les clients connectés
    io.emit('update', currentData);

    // Affichage des données en temps réel dans la console
    console.log(`Température en temps réel : ${currentData.temperature}°C`);
    console.log(`Humidité en temps réel : ${currentData.humidity}%`);

  } catch (err) {
    console.error('Erreur de parsing des données Arduino :', err.message);
  }
});

// Gestion des erreurs du port série
port.on('open', () => console.log(`Port série ouvert sur ${SERIAL_PORT}`));
port.on('error', (err) => console.error('Erreur port série :', err.message));

// Lancement du serveurod
server.listen(PORT, () => {
  console.log(`Serveur Node.js actif sur http://localhost:${PORT}`);
  console.log(`Serveur actif. État initial du ventilateur : ${fanState ? 'ON' : 'OFF'}`);


});