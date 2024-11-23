const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Récupérer le token depuis les cookies
        const token = req.cookies.authToken; // Le cookie doit être appelé 'authToken' ici

        // Si le token n'est pas présent
        if (!token) {
            return res.status(401).json({ error: 'Accès non autorisé, veuillez vous connecter' });
        }

        // Vérifier et décoder le token JWT
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;

        // Ajouter l'ID de l'utilisateur à l'objet `req.auth`
        req.auth = {
            userId: userId
        };

        // Passer au middleware suivant ou à la route
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token invalide ou expiré' });
    }
};
