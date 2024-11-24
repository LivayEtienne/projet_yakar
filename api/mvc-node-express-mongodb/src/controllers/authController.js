const User = require('../models/User'); // Importer le modèle User
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'ma_super_cle_secrete'; // Utilisation de la variable d'environnement, avec une valeur par défaut

// Simuler la liste noire des tokens (à remplacer par Redis ou une base de données en production)
let blacklistedTokens = []; // Liste noire des tokens invalidés

// Inscription d'un nouvel utilisateur
exports.signup = async (req, res) => {
  const { email, mot_de_passe, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const newUser = new User({
      email,
      mot_de_passe,
      role: role || 'user' // Rôle par défaut : utilisateur simple
    });

    await newUser.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès', user: { email: newUser.email, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer un token JWT avec le rôle de l'utilisateur
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Ajout du rôle dans le payload
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Vérification si un token est dans la liste noire
const isBlacklisted = (token) => blacklistedTokens.includes(token);

// Déconnexion de l'utilisateur
exports.logout = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'Aucun token fourni' });
  }

  if (isBlacklisted(token)) {
    return res.status(400).json({ message: 'Token déjà invalidé' });
  }

  // Ajouter le token à la liste noire
  blacklistedTokens.push(token);
  res.status(200).json({ message: 'Déconnexion réussie' });
};

// Middleware pour protéger les routes
exports.protect = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // "Bearer [token]"

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé, token manquant' });
  }

  // Vérifier si le token est dans la liste noire
  if (isBlacklisted(token)) {
    return res.status(401).json({ message: 'Veuillez vous reconnecter, votre session est expirée ou invalidée' });
  }

  try {
    // Vérifier le token avec la clé secrète
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // Ajouter les informations de l'utilisateur au request
    next();  // Passer au prochain middleware ou à la route
  } catch (error) {
    res.status(400).json({ message: 'Token invalide', error: error.message });
  }
};

// Middleware pour vérifier le rôle
exports.checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Accès refusé. Vous devez être connecté pour accéder à cette route.' });
    }

    // Si l'utilisateur est un admin, il a accès à toutes les routes
    if (req.user.role === 'admin') {
      return next();  // L'admin peut tout faire
    }

    // Si l'utilisateur est un user, il peut uniquement faire des requêtes GET
    if (req.user.role === 'user' && req.method === 'GET') {
      return next();  // L'utilisateur simple peut faire des GET uniquement
    }

    // Si l'utilisateur est un user et essaie de faire une autre requête (POST, PUT, DELETE)
    return res.status(403).json({ message: 'Accès refusé. Les utilisateurs simples peuvent uniquement faire des requêtes GET.' });
  };
};

// Route protégée pour récupérer les informations de l'utilisateur connecté
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-mot_de_passe');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Données utilisateur récupérées avec succès', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
};

// Route protégée pour récupérer la liste des utilisateurs
exports.getUserList = async (req, res) => {
  // Vérifier si l'utilisateur est connecté (token valide)
  if (!req.user) {
    return res.status(401).json({ message: 'Accès refusé. Vous devez être connecté pour voir la liste des utilisateurs.' });
  }

  try {
    // L'utilisateur connecté a accès à la liste des utilisateurs
    const users = await User.find().select('-mot_de_passe'); // Récupérer tous les utilisateurs sans leur mot de passe
    res.status(200).json({ message: 'Liste des utilisateurs récupérée avec succès', users });
  } catch (error) {
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
};

// Archiver un utilisateur
exports.archiveUser = async (req, res) => {
  const { id } = req.params;  // L'ID de l'utilisateur à archiver

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Archiver l'utilisateur (mettre à jour le champ 'archived')
    user.archived = true;
    await user.save();  // Sauvegarder les changements dans la base de données

    res.status(200).json({ message: 'Utilisateur archivé avec succès', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'archivage de l\'utilisateur', error: error.message });
  }
};



