import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { SerialPort, ReadlineParser } from 'serialport';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io'; 
import http from 'http'; 
import cron from 'node-cron'; 

dotenv.config();

const app = express();
const server = http.createServer(app); 
const io = new SocketIOServer(server); 
const PORT = process.env.PORT || 3001;
const MONGO_URI = 'mongodb://localhost:27017/gestionTempHumid';
const SERIAL_PORT = '/dev/ttyACM0'; 

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.error('Erreur MongoDB:', err));

const mesureSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const MesureModel = mongoose.model('Mesure', mesureSchema);

const configSchema = new mongoose.Schema({
  hours: [Number],
  minutes: [Number],
});

const Config = mongoose.model('Config', configSchema);

let currentData = {
  temperature: null,
  humidity: null,
  timestamp: null,
};

function getSensorData() {
  return {
    temperature: Math.floor(Math.random() * 10) + 20, 
    humidity: Math.floor(Math.random() * 20) + 40,   
    timestamp: new Date(),
  };
}

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

async function configureCronJobs() {
  try {
    const config = await Config.findOne();
    
    if (config) {
      const { hours, minutes } = config;

      cron.getTasks().forEach((task) => task.destroy());

      hours.forEach((hour) => {
        minutes.forEach((minute) => {
          const cronExpression = `${minute} ${hour} * * *`;
          
          cron.schedule(cronExpression, () => {
            console.log(`Enregistrement des données à ${hour}:${minute}`);
            saveData(); 
          });
        });
      });

      console.log('Les tâches cron ont été reconfigurées avec succès.');
    } else {
      console.error('Aucune configuration trouvée dans la base de données.');
    }
  } catch (err) {
    console.error('Erreur lors de la reconfiguration des tâches cron:', err);
  }
}

configureCronJobs();

app.get('/api/mesures/specific-times', async (req, res) => {
  try {
    const config = await Config.findOne();

    if (!config) {
      return res.status(404).json({ message: 'Configuration des heures introuvable' });
    }

    const { hours, minutes } = config;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const mesures = await MesureModel.find({
      timestamp: { $gte: today, $lt: tomorrow },
    }).sort({ timestamp: 1 });

    const filteredMesures = [];

    hours.forEach(hour => {
      minutes.forEach(minute => {
        const mesure = mesures.find(m => {
          const mesureDate = new Date(m.timestamp);
          return mesureDate.getHours() === parseInt(hour, 10) && mesureDate.getMinutes() === parseInt(minute, 10);
        });
        if (mesure) {
          filteredMesures.push({
            temperature: mesure.temperature,
            humidity: mesure.humidity,
            timestamp: mesure.timestamp,
          });
        }
      });
    });

    res.json({
      message: 'Mesures récupérées avec succès',
      data: filteredMesures,
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des données:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

app.post('/api/configure-times', async (req, res) => {
  const { hours, minutes } = req.body;

  if (!Array.isArray(hours) || !Array.isArray(minutes)) {
    return res.status(400).json({ message: 'Format invalide pour les heures ou minutes' });
  }

  try {
    const updatedConfig = await Config.findOneAndUpdate(
      {},  
      { hours, minutes },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: 'Configuration mise à jour',
      configuredTimes: updatedConfig
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la mise à jour', error });
  }
});

app.get('/api/configure-times', async (req, res) => {
  try {
    const config = await Config.findOne({});  
    if (!config) {
      return res.status(404).json({ message: 'Configuration non trouvée' });
    }
    return res.status(200).json(config);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération des configurations', error });
  }
});

app.get('/api/historique/hebdomadaire', async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); 

    const mesures = await MesureModel.find({
      timestamp: { $gte: startOfWeek }
    }).sort({ timestamp: 1 });

    const response = mesures.map(mesure => ({
      date: mesure.timestamp.toLocaleDateString('fr-FR', { weekday: 'long' }), 
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

app.get('/api/real-time/humidity', (req, res) => {
  if (currentData.humidity !== null) {
    res.json({ humidity: currentData.humidity, timestamp: currentData.timestamp });
  } else {
    res.status(404).json({ message: 'Aucune donnée d\'humidité disponible.' });
  }
});

app.get('/api/real-time/temperature', (req, res) => {
  if (currentData.temperature !== null) {
    res.json({ temperature: currentData.temperature, timestamp: currentData.timestamp });
  } else {
    res.status(404).json({ message: 'Aucune donnée de température disponible.' });
  }
});

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

const port = new SerialPort({ path: SERIAL_PORT, baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

io.on('connection', (socket) => {
  console.log('Client connecté :', socket.id);

  socket.on('toggleFan', (status) => {
    // Logique de contrôle du ventilateur ici
  });
});

let fanState = false;

app.post('/api/fan/control', (req, res) => {
  const { state } = req.body;

  if (typeof state !== 'boolean') {
    return res.status(400).json({ message: 'Le statut du ventilateur doit être un booléen' });
  }

  fanState = state;

  // Simuler l'envoi de la commande à l'Arduino pour contrôler le ventilateur
  console.log(fanState ? 'Ventilateur activé' : 'Ventilateur désactivé');

  res.json({ message: 'Contrôle du ventilateur effectué', fanState });
});

parser.on('data', (data) => {
  console.log('Données reçues de Arduino:', data);
  currentData = getSensorData(); 
  io.emit('real-time', currentData);
});

server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
