const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware pour vérifier si l'utilisateur est un admin
module.exports = (req, res, next) => {
  try {
    // Récupérer le token d'autorisation depuis les cookies
    const token = req.cookies.authToken; // Assurez-vous que le nom du cookie est 'authToken'
    
    // Si le token est absent
    if (!token) {
      return res.status(401).json({ message: 'Token manquant, authentification requise.' });
    }

    // Vérifier et décoder le token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    
    // Extraire l'ID de l'utilisateur à partir du token
    const userId = decodedToken.userId;

    // Vérifier si l'utilisateur existe dans la base de données
    User.findById(userId)
      .then(user => {
        if (!user) {
          return res.status(401).json({ message: 'Utilisateur non trouvé !' });
        }
        
        // Vérifier si l'utilisateur a le rôle 'admin'
        if (user.role !== 'admin') {
          return res.status(403).json({ message: 'Accès interdit, rôle insuffisant.' });
        }

        // Si l'utilisateur est un admin, passer au middleware suivant
        next();
      })
      .catch(error => {
        res.status(500).json({ message: 'Erreur interne du serveur', error });
      });
  } catch (error) {
    // En cas de token invalide ou expiré
    res.status(401).json({ message: 'Authentification échouée' });
  }
};
