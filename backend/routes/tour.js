const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

// Rotas públicas para tours
router.get('/details/:id', tourController.getPublicTour);
router.get('/search', tourController.searchTours);
router.get('/featured', tourController.getFeaturedTours);

module.exports = router;