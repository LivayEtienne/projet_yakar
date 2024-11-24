const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController'); // Assurez-vous que le chemin est correct
const { authMiddleware } = require('../middlewares/authMiddleware');

// Définir les routes en appelant directement les fonctions exportées du controller
router.post('/items', bookController.createData);
router.get('/items', authMiddleware, bookController.getAllData);
router.get('/items/:id', bookController.getDataById);
router.put('/items/:id', bookController.updateData);
router.delete('/items/:id', bookController.deleteData);

module.exports = router;
