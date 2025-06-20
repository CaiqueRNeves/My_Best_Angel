const Angel = require('../models/Angel');
const Tour = require('../models/Tour');
const Visitor = require('../models/Visitor');
const Booking = require('../models/Booking'); // ADICIONADO: Import faltando
const MessageService = require('../services/MessageService');
const TourService = require('../services/TourService');
const { catchAsync } = require('../middleware/errorHandler');
const { ApiResponse, createPaginationMeta } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * @swagger
 * tags:
 *   name: Angels
 *   description: Operações relacionadas aos guias turísticos
 */

/**
 * @swagger
 * /api/angel/dashboard:
 *   get:
 *     summary: Buscar dados do dashboard do Angel
 *     tags: [Angels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do dashboard recuperados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     angel:
 *                       $ref: '#/components/schemas/Angel'
 *                     upcomingTours:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Tour'
 *                     visitors:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Visitor'
 *                     unreadMessages:
 *                       type: integer
 *                     stats:
 *                       type: object
 */
exports.dashboard = catchAsync(async (req, res) => {
  const angelId = req.user.id;

  logger.business('Angel dashboard accessed', { angelId });

  // Buscar informações do Angel
  const angel = await Angel.findById(angelId);
  if (!angel) {
    throw AppError.angelNotFound(angelId);
  }

  // Buscar próximos tours (limitado a 5)
  const upcomingTours = await Tour.findUpcomingByAngelId(angelId, 5);

  // Buscar visitors afiliados
  const visitors = await Visitor.findByAngelId(angelId);

  // Buscar mensagens não lidas
  const unreadMessages = await MessageService.countUnreadMessages(angelId, 'angel');

  // Buscar estatísticas gerais
  const stats = await angel.getStats();

  ApiResponse.success(res, {
    angel: angel.toJSON(),
    upcomingTours: upcomingTours.map(tour => tour.toJSON()),
    visitors: visitors.map(visitor => visitor.toPublicJSON()),
    unreadMessages,
    stats
  }, 'Dashboard carregado com sucesso');
});

/**
 * @swagger
 * /api/angel/profile:
 *   get:
 *     summary: Buscar perfil do Angel
 *     tags: [Angels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil recuperado com sucesso
 */
exports.getProfile = catchAsync(async (req, res) => {
  const angelId = req.params.id || req.user.id;
  const isOwnProfile = req.user.id === parseInt(angelId);

  const angel = await Angel.findById(angelId);
  if (!angel) {
    throw AppError.angelNotFound(angelId);
  }

  // Se não for o próprio perfil, retornar versão pública
  const profileData = isOwnProfile ? angel.toJSON() : angel.toPublicJSON();

  // Buscar tours disponíveis se for perfil público
  if (!isOwnProfile) {
    const tours = await Tour.findUpcomingByAngelId(angelId);
    profileData.tours = tours.map(tour => tour.toPublicJSON());
  }

  ApiResponse.success(res, {
    angel: profileData,
    isOwnProfile
  }, 'Perfil carregado com sucesso');
});

// ADICIONADO: Método showProfile para compatibilidade com rotas existentes
exports.showProfile = exports.getProfile;

/**
 * @swagger
 * /api/angel/profile:
 *   put:
 *     summary: Atualizar perfil do Angel
 *     tags: [Angels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *               phone:
 *                 type: string
 *               bio:
 *                 type: string
 *               languages:
 *                 type: string
 *               specialty:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 */
exports.updateProfile = catchAsync(async (req, res) => {
  const angelId = req.user.id;
  const { name, phone, bio, languages, specialty } = req.body;

  // Validar entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.fromValidationErrors(res, errors);
  }

  logger.business('Angel profile update attempt', { angelId, fields: Object.keys(req.body) });

  // Buscar Angel
  const angel = await Angel.findById(angelId);
  if (!angel) {
    throw AppError.angelNotFound(angelId);
  }

  // Atualizar dados
  angel.name = name;
  angel.phone = phone || '';
  angel.bio = bio || '';
  angel.languages = languages || '';
  angel.specialty = specialty || '';

  // Validar e salvar
  angel.validate();
  await angel.save();

  logger.business('Angel profile updated', { angelId });

  ApiResponse.updated(res, angel.toJSON(), 'Perfil atualizado com sucesso');
});

/**
 * @swagger
 * /api/angel/tours:
 *   post:
 *     summary: Criar novo tour
 *     tags: [Angels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TourInput'
 *     responses:
 *       201:
 *         description: Tour criado com sucesso
 */
exports.createTour = catchAsync(async (req, res) => {
  const angelId = req.user.id;

  // Validar entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.fromValidationErrors(res, errors);
  }

  logger.business('Tour creation attempt', { angelId, tourData: req.body });

  // Criar tour
  const tourId = await TourService.createTour(angelId, req.body);
  const tour = await Tour.findById(tourId);

  logger.business('Tour created', { angelId, tourId });

  ApiResponse.created(res, tour.toJSON(), 'Tour criado com sucesso');
});

/**
 * @swagger
 * /api/angel/tours:
 *   get:
 *     summary: Listar tours do Angel
 *     tags: [Angels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [upcoming, past, all]
 *           default: all
 *     responses:
 *       200:
 *         description: Tours recuperados com sucesso
 */
exports.getTours = catchAsync(async (req, res) => {
  const angelId = req.user.id;
  const { page = 1, limit = 10, status = 'all' } = req.query;
  const offset = (page - 1) * limit;

  // Buscar tours com filtros
  const filters = { angel_id: angelId };
  if (status === 'upcoming') {
    filters.upcoming = true;
  } else if (status === 'past') {
    filters.past = true;
  }

  const tours = await Tour.findWithFilters(filters, {
    limit: parseInt(limit),
    offset: parseInt(offset),
    orderBy: 'date',
    orderDirection: status === 'past' ? 'desc' : 'asc'
  });

  const total = await Tour.count(filters);
  const pagination = createPaginationMeta(page, limit, total);

  ApiResponse.paginated(res, tours.map(tour => tour.toJSON()), pagination);
});

/**
 * @swagger
 * /api/angel/tours/{id}:
 *   get:
 *     summary: Buscar detalhes de um tour específico
 *     tags: [Angels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tour encontrado
 *       404:
 *         description: Tour não encontrado
 */
exports.getTour = catchAsync(async (req, res) => {
  const tourId = req.params.id;
  const angelId = req.user.id;

  // Buscar detalhes do tour
  const tour = await Tour.findByIdAndAngelId(tourId, angelId);
  if (!tour) {
    throw AppError.tourNotFound(tourId);
  }

  // Buscar reservas para este tour
  const bookings = await Booking.findByTourId(tourId);

  ApiResponse.success(res, {
    tour: tour.toJSON(),
    bookings: bookings.map(booking => booking.toJSON())
  }, 'Tour encontrado');
});

/**
 * @swagger
 * /api/angel/tours/{id}:
 *   put:
 *     summary: Atualizar tour
 *     tags: [Angels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TourInput'
 *     responses:
 *       200:
 *         description: Tour atualizado com sucesso
 */
exports.updateTour = catchAsync(async (req, res) => {
  const tourId = req.params.id;
  const angelId = req.user.id;

  // Validar entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.fromValidationErrors(res, errors);
  }

  logger.business('Tour update attempt', { angelId, tourId, updateData: req.body });

  // Atualizar tour
  await TourService.updateTour(tourId, angelId, req.body);
  const updatedTour = await Tour.findById(tourId);

  logger.business('Tour updated', { angelId, tourId });

  ApiResponse.updated(res, updatedTour.toJSON(), 'Tour atualizado com sucesso');
});

/**
 * @swagger
 * /api/angel/tours/{id}:
 *   delete:
 *     summary: Cancelar/deletar tour
 *     tags: [Angels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tour cancelado com sucesso
 */
exports.cancelTour = catchAsync(async (req, res) => {
  const tourId = req.params.id;
  const angelId = req.user.id;

  logger.business('Tour cancellation attempt', { angelId, tourId });

  // Cancelar tour
  await TourService.cancelTour(tourId, angelId);

  logger.business('Tour cancelled', { angelId, tourId });

  ApiResponse.deleted(res, 'Tour cancelado com sucesso');
});

/**
 * @swagger
 * /api/angel/visitors:
 *   get:
 *     summary: Listar visitantes afiliados
 *     tags: [Angels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Visitantes recuperados com sucesso
 */
exports.getVisitors = catchAsync(async (req, res) => {
  const angelId = req.user.id;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  // Buscar todos os visitantes afiliados
  const visitors = await Visitor.findWithFilters(
    { angel_id: angelId },
    { limit: parseInt(limit), offset: parseInt(offset) }
  );

  const total = await Visitor.count({ angel_id: angelId });
  const pagination = createPaginationMeta(page, limit, total);

  ApiResponse.paginated(res, visitors.map(visitor => visitor.toPublicJSON()), pagination);
});

/**
 * @swagger
 * /api/angel/messages:
 *   get:
 *     summary: Buscar mensagens do Angel
 *     tags: [Angels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mensagens recuperadas com sucesso
 */
exports.getMessages = catchAsync(async (req, res) => {
  const angelId = req.user.id;

  // Buscar mensagens do Angel
  const messageData = await MessageService.getAngelMessages(angelId);

  ApiResponse.success(res, messageData, 'Mensagens carregadas com sucesso');
});

/**
 * @swagger
 * /api/angel/messages:
 *   post:
 *     summary: Enviar mensagem para visitante
 *     tags: [Angels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - visitorId
 *               - content
 *             properties:
 *               visitorId:
 *                 type: integer
 *               content:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: Mensagem enviada com sucesso
 */
exports.sendMessage = catchAsync(async (req, res) => {
  const angelId = req.user.id;
  const { visitorId, content } = req.body;

  // Validar entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.fromValidationErrors(res, errors);
  }

  logger.business('Message sent by angel', { angelId, visitorId });

  // Enviar mensagem
  const messageId = await MessageService.sendAngelMessage(angelId, visitorId, content);

  ApiResponse.created(res, { messageId }, 'Mensagem enviada com sucesso');
});

/**
 * @swagger
 * /api/angel/insights:
 *   get:
 *     summary: Buscar insights e estatísticas
 *     tags: [Angels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Insights recuperados com sucesso
 */
exports.getInsights = catchAsync(async (req, res) => {
  const angelId = req.user.id;

  // Buscar estatísticas detalhadas
  const angel = await Angel.findById(angelId);
  const stats = await angel.getStats();

  // Buscar estatísticas de tours e locais populares
  const { tourStats, popularLocations, bookingStats } = await TourService.getAngelTourStats(angelId);

  // Sugestões de tours populares em Belém
  const popularTours = [
    {
      title: 'Mercado Ver-o-Peso',
      description: 'O famoso mercado Ver-o-Peso é o maior mercado a céu aberto da América Latina e um símbolo de Belém.',
      category: 'Cultural'
    },
    {
      title: 'Estação das Docas',
      description: 'Um complexo turístico à beira do rio com restaurantes, bares e lojas em antigos galpões portuários.',
      category: 'Gastronomia'
    },
    {
      title: 'Museu Emílio Goeldi',
      description: 'Um dos mais importantes museus de história natural e etnografia da Amazônia.',
      category: 'Cultural'
    },
    {
      title: 'Basílica de Nazaré',
      description: 'Santuário que abriga a imagem de Nossa Senhora de Nazaré, padroeira dos paraenses.',
      category: 'Religioso'
    },
    {
      title: 'Mangal das Garças',
      description: 'Parque naturalístico com fauna e flora amazônicas, incluindo um borboletário e um mirante.',
      category: 'Natureza'
    }
  ];

  // Sugestões de pratos típicos paraenses
  const typicalDishes = [
    {
      name: 'Pato no Tucupi',
      description: 'Pato assado servido com molho de tucupi (líquido extraído da mandioca) e jambu (erva típica).'
    },
    {
      name: 'Tacacá',
      description: 'Caldo quente feito com tucupi, jambu, camarão seco e goma de tapioca.'
    },
    {
      name: 'Maniçoba',
      description: 'Prato feito com folhas de mandioca moídas e cozidas por dias, servido com carnes variadas.'
    },
    {
      name: 'Açaí',
      description: 'Servido como uma pasta espessa, geralmente acompanhado de farinha de tapioca e peixe frito.'
    },
    {
      name: 'Vatapá',
      description: 'Creme à base de pão, camarão seco, amendoim, castanha de caju, leite de coco e dendê.'
    }
  ];

  ApiResponse.success(res, {
    stats,
    tourStats,
    popularLocations,
    bookingStats,
    suggestions: {
      popularTours,
      typicalDishes
    },
    reviewStats: {
      averageRating: angel.rating,
      totalReviews: angel.reviews_count
    }
  }, 'Insights carregados com sucesso');
});