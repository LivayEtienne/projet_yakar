const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./db');
const mongoose = require('mongoose');
const userRoutes = require('./route/user');
const donnesRoutes = require('./route/donnes');

const app = express();

app.use(cookieParser());

connectDB();

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());

// Middleware pour gérer les CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Utilisation des routes pour l'authentification
app.use('/api/auth', userRoutes);
app.use('/api/donnes', donnesRoutes);

app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' });
});

module.exports = app;
