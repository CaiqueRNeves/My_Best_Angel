const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin, validateAngelRegister, validateVisitorRegister, validate } = require('../middleware/validation');

// Login
router.post('/login', validateLogin, validate, authController.login);

// Registro
router.post('/register/angel', validateAngelRegister, validate, authController.registerAngel);
router.post('/register/visitor', validateVisitorRegister, validate, authController.registerVisitor);

// Obter Angels disponíveis para afiliação
router.get('/available-angels', authController.getAvailableAngels);

module.exports = router;