const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');  // Assure-toi que le chemin est correct
const authMiddleware = require('../middlewares/authMiddleware');  // Import du middleware d'authentification
const User = require('../models/User');

// Route d'inscription
router.post('/signup', authMiddleware.authMiddleware, authController.signup);

// Route de connexion
router.post('/login', authController.login);
// Route de connexion en tant qu'utilisateur simple

// Route de déconnexion - Utilisation de la liste noire des tokens
router.post('/logout', (req, res) => {
  try {
    // Effacer le cookie authToken
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS en production
      sameSite: 'strict',
    });
    return res.status(200).json({ msg: 'Déconnexion réussie' });
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
  }
});

// Route pour récupérer la liste des utilisateurs
router.get('/user-list', authMiddleware.authMiddleware, async (req, res) => {
  try {
    // Vérifier si l'utilisateur est connecté
    if (!req.user) {
      return res.status(401).json({ message: 'Accès refusé. Vous devez être connecté pour voir la liste des utilisateurs.' });
    }
    
    // Récupérer la liste des utilisateurs, en excluant les mots de passe
    const users = await User.find().select('-mot_de_passe');
    res.status(200).json({ message: 'Liste des utilisateurs récupérée avec succès', users });
  } catch (error) {
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
});

// Route pour récupérer les informations de l'utilisateur connecté
router.get('/user-info', authMiddleware.authMiddleware, authController.getUserInfo);

// Route protégée pour les super-admin
router.get('/super-admin', authMiddleware.authMiddleware, authController.checkRole('super-admin'), (req, res) => {
  res.status(200).json({ message: 'Accès autorisé, vous êtes un super-admin' });
});

// Route protégée pour les admins pour archiver un utilisateur
router.patch('/archive/:id', authMiddleware.authMiddleware, authController.checkRole('admin'), authController.archiveUser);

module.exports = router;
