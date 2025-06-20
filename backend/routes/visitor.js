const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');
const { isAuthenticated, isVisitor } = require('../middleware/auth');
const { validateVisitorProfileUpdate, validateMessage, validateReview, validate } = require('../middleware/validation');

// Middleware para verificar autenticação e tipo de usuário
router.use(isAuthenticated);
router.use(isVisitor);

// Dashboard
router.get('/dashboard', visitorController.dashboard);

// Perfil - CORRIGIDO: usar getProfile que existe no controller
router.get('/profile', visitorController.getProfile);
router.put('/profile', validateVisitorProfileUpdate, validate, visitorController.updateProfile);

// Tours
router.get('/available-tours', visitorController.getAvailableTours);
router.get('/tours/:id', visitorController.getTour);
router.post('/tours/:id/book', visitorController.bookTour); // CORRIGIDO: URL simplificada
router.post('/tours/:id/review', validateReview, validate, visitorController.rateTour); // CORRIGIDO: URL simplificada

// Reservas (Bookings) - CORRIGIDO: rotas organizadas
router.get('/bookings', visitorController.getBookings);
router.post('/bookings/:id/cancel', visitorController.cancelBooking);

// Mensagens
router.get('/messages', visitorController.getMessages);
router.post('/messages', validateMessage, validate, visitorController.sendMessage);

// Estatísticas - ADICIONADO: rota que faltava
router.get('/stats', visitorController.getStats);

module.exports = router;