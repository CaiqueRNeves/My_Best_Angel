const TourService = require('../services/TourService');
const Review = require('../models/Review');

// Mostrar detalhe público de um tour
exports.getPublicTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    const tourData = await TourService.getPublicTourDetails(tourId);
    
    // Buscar reviews adicionais
    const reviews = await Review.findByTourId(tourId, 5);
    
    res.status(200).json({
      success: true,
      data: {
        ...tourData,
        reviews
      }
    });
  } catch (error) {
    console.error('Erro ao buscar tour:', error.message);
    res.status(404).json({
      success: false,
      message: error.message || 'Tour não encontrado'
    });
  }
};

// Buscar tours com base em critérios
exports.searchTours = async (req, res) => {
  try {
    const { search, date, location } = req.query;
    const searchData = await TourService.searchTours({ search, date, location });
    
    res.status(200).json({
      success: true,
      data: searchData
    });
  } catch (error) {
    console.error('Erro ao buscar tours:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao buscar tours'
    });
  }
};

// Listar tours em destaque
exports.getFeaturedTours = async (req, res) => {
  try {
    const tours = await TourService.getFeaturedTours();
    
    res.status(200).json({
      success: true,
      data: tours
    });
  } catch (error) {
    console.error('Erro ao buscar tours em destaque:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar tours em destaque'
    });
  }
};