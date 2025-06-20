const express = require('express');
const router = express.Router();
const angelController = require('../controllers/angelController');
const { isAuthenticated, isAngel } = require('../middleware/auth');
const { validateAngelProfileUpdate, validateTour, validateMessage, validate } = require('../middleware/validation');

// Middleware para verificar autenticação e tipo de usuário
router.use(isAuthenticated);
router.use(isAngel);

// Dashboard
router.get('/dashboard', angelController.dashboard);

// Perfil - CORRIGIDO: usar getProfile que existe no controller
router.get('/profile', angelController.getProfile);
router.get('/profile/:id', angelController.getProfile);
router.put('/profile', validateAngelProfileUpdate, validate, angelController.updateProfile);

// Tours
router.post('/tours', validateTour, validate, angelController.createTour);
router.get('/tours', angelController.getTours);
router.get('/tours/:id', angelController.getTour);
router.put('/tours/:id', validateTour, validate, angelController.updateTour);
router.delete('/tours/:id', angelController.cancelTour);

// Visitantes
router.get('/visitors', angelController.getVisitors);

// Mensagens
router.get('/messages', angelController.getMessages);
router.post('/messages', validateMessage, validate, angelController.sendMessage);

// Insights
router.get('/insights', angelController.getInsights);

module.exports = router;