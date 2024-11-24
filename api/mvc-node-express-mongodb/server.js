const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Pour gérer CORS
require('dotenv').config();

// Import des routes
const temperatureRoutes = require('./src/routes/temperatureRoute');  // Routes de température
const authRoutes = require('./src/routes/authRoutes');  // Routes d'authentification
const dataRoutes = require('./src/routes/bookRoutes'); // Routes de données
const { collectData } = require('./src/donnee/cron');  // Fonction cron pour la collecte de température

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());  // Middleware pour parser les requêtes JSON
app.use(cors());  // Middleware pour gérer CORS

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/base_api_1', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/api/data', dataRoutes);  // Préfixe pour les routes de données
app.use('/api/auth', authRoutes);  // Préfixe pour les routes d'authentification
app.use('/api', temperatureRoutes);  // Préfixe pour les routes de température

// Lancer la collecte des données de température
collectData();  // Démarre immédiatement la collecte des données

// Middleware global pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
