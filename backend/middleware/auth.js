import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret';

const blacklistedTokens = [];



export const authMiddleware = (req, res, next) => {
  // Récupérer le token depuis les cookies
const token = req.cookies.token;

if (!token) {
  return res.status(401).json({ error: 'Veuillez vous connecter' });
}

try {
  // Vérifier le token JWT
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded; // Ajoute les informations de l'utilisateur à req
  next(); // Passe à la route suivante
} catch (err) {
  return res.status(403).json({ error: 'Token invalide' });
}
}

// Fonction pour vérifier le rôle d'administrateur
export const checkAdminRole = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next(); // L'utilisateur est un admin, passez au middleware suivant
  }
  return res.status(403).json({ message: 'Accès refusé, rôle administrateur requis' });
};

export default authMiddleware;