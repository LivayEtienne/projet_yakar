const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'ma_super_cle_secrete'; // Utilisation de la clé secrète

// Simuler la liste noire des tokens (à remplacer par une solution comme Redis ou une base de données en production)
let blacklistedTokens = []; // Liste noire des tokens invalidés

// Middleware d'authentification
const authMiddleware = (req, res, next) => {
  // Récupérer le token depuis l'en-tête "Authorization"
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé, veuillez vous connecter' });
  }

  // Vérifier si le token est dans la liste noire
  if (blacklistedTokens.includes(token)) {
    return res.status(401).json({ message: 'Token invalide, veuillez vous reconnecter' });
  }

  try {
    // Vérifier le token avec la clé secrète
    const decoded = jwt.verify(token, JWT_SECRET);  // Utilisation de la clé secrète

    req.user = decoded;  // Ajouter les informations de l'utilisateur au request
    next();  // Passer au prochain middleware ou à la route
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré, veuillez vous reconnecter' });
    }
    res.status(400).json({ message: 'Token invalide', error: error.message });
  }
};

// Fonction de déconnexion qui ajoute le token à la liste noire
const logout = (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'Aucun token fourni' });
  }

  // Ajouter le token à la liste noire
  blacklistedTokens.push(token);  // Ajouter à la liste noire

  return res.status(200).json({ message: 'Déconnexion réussie' });
};

module.exports = { authMiddleware, logout };
