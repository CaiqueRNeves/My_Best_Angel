const Visitor = require('../models/Visitor');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
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
 *   name: Visitors
 *   description: Operações relacionadas aos visitantes
 */

/**
 * @swagger
 * /api/visitor/dashboard:
 *   get:
 *     summary: Buscar dados do dashboard do visitante
 *     tags: [Visitors]
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
 *                     visitor:
 *                       $ref: '#/components/schemas/Visitor'
 *                     upcomingTours:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Booking'
 *                     bookingHistory:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Booking'
 *                     unreadMessages:
 *                       type: integer
 *                     recentUpdates:
 *                       type: array
 *                       items:
 *                         type: object
 */
exports.dashboard = catchAsync(async (req, res) => {
  const visitorId = req.user.id;

  logger.business('Visitor dashboard accessed', { visitorId });

  // Buscar informações do Visitor com detalhes do Angel
  const visitor = await Visitor.findByIdWithAngelDetails(visitorId);
  if (!visitor) {
    throw AppError.visitorNotFound(visitorId);
  }

  // Buscar próximos tours agendados
  const upcomingTours = await Booking.findUpcomingByVisitorId(visitorId);

  // Buscar histórico de agendamentos (últimos 10)
  const bookingHistory = await Booking.findHistoryByVisitorId(visitorId, 10);

  // Buscar mensagens não lidas
  const unreadMessages = await MessageService.countUnreadMessages(visitorId, 'visitor');

  // Buscar tours recentes do Angel como atualizações
  const recentTours = await Tour.findUpcomingByAngelId(visitor.angel_id, 10);
  
  const recentUpdates = recentTours.map(tour => ({
    id: tour.id,
    title: tour.title,
    location: tour.location,
    date: tour.date,
    type: 'tour_created',
    updated_at: tour.updated_at,
    formattedDate: tour.getFormattedDate(),
    relativeDate: tour.getRelativeDate()
  }));

  ApiResponse.success(res, {
    visitor: visitor.toJSON(),
    upcomingTours: upcomingTours.map(booking => ({
      ...booking.toJSON(),
      formattedDate: booking.getFormattedDate?.() || new Date(booking.tour_date).toLocaleDateString('pt-BR')
    })),
    bookingHistory: bookingHistory.map(booking => ({
      ...booking.toJSON(),
      formattedDate: booking.getFormattedDate?.() || new Date(booking.tour_date).toLocaleDateString('pt-BR')
    })),
    unreadMessages,
    recentUpdates
  }, 'Dashboard carregado com sucesso');
});

/**
 * @swagger
 * /api/visitor/profile:
 *   get:
 *     summary: Buscar perfil do visitante
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil recuperado com sucesso
 */
exports.getProfile = catchAsync(async (req, res) => {
  const visitorId = req.user.id;

  // Buscar Visitor com dados do Angel
  const visitor = await Visitor.findByIdWithAngelDetails(visitorId);
  if (!visitor) {
    throw AppError.visitorNotFound(visitorId);
  }

  ApiResponse.success(res, visitor.toJSON(), 'Perfil carregado com sucesso');
});

// ADICIONADO: Método showProfile para compatibilidade com rotas existentes
exports.showProfile = exports.getProfile;

/**
 * @swagger
 * /api/visitor/profile:
 *   put:
 *     summary: Atualizar perfil do visitante
 *     tags: [Visitors]
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
 *               nationality:
 *                 type: string
 *               languagePreference:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 */
exports.updateProfile = catchAsync(async (req, res) => {
  const visitorId = req.user.id;
  const { name, phone, nationality, languagePreference } = req.body;

  // Validar entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.fromValidationErrors(res, errors);
  }

  logger.business('Visitor profile update attempt', { visitorId, fields: Object.keys(req.body) });

  // Buscar Visitor
  const visitor = await Visitor.findById(visitorId);
  if (!visitor) {
    throw AppError.visitorNotFound(visitorId);
  }

  // Atualizar dados
  visitor.name = name;
  visitor.phone = phone || '';
  visitor.nationality = nationality || '';
  visitor.language_preference = languagePreference || '';

  // Validar e salvar
  visitor.validate();
  await visitor.save();

  logger.business('Visitor profile updated', { visitorId });

  ApiResponse.updated(res, visitor.toJSON(), 'Perfil atualizado com sucesso');
});

/**
 * @swagger
 * /api/visitor/available-tours:
 *   get:
 *     summary: Listar tours disponíveis do guia associado
 *     tags: [Visitors]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por título ou localização
 *     responses:
 *       200:
 *         description: Tours disponíveis recuperados com sucesso
 */
exports.getAvailableTours = catchAsync(async (req, res) => {
  const visitorId = req.user.id;
  const { page = 1, limit = 10, search } = req.query;
  const offset = (page - 1) * limit;

  // Buscar o Visitor para obter o Angel associado
  const visitor = await Visitor.findById(visitorId);
  if (!visitor) {
    throw AppError.visitorNotFound(visitorId);
  }

  // Buscar tours disponíveis do Angel associado
  const filters = { 
    angel_id: visitor.angel_id,
    upcoming: true,
    available: true
  };

  if (search) {
    filters.search = search;
  }

  const tours = await Tour.findAvailableForVisitor(visitorId, visitor.angel_id, {
    limit: parseInt(limit),
    offset: parseInt(offset),
    search
  });

  const total = await Tour.countAvailableForVisitor(visitorId, visitor.angel_id, { search });
  const pagination = createPaginationMeta(page, limit, total);

  ApiResponse.paginated(res, tours.map(tour => ({
    ...tour.toJSON(),
    formattedDate: tour.getFormattedDate(),
    relativeDate: tour.getRelativeDate(),
    isFullyBooked: tour.isFullyBooked(),
    already_booked: tour.already_booked
  })), pagination);
});

/**
 * @swagger
 * /api/visitor/tours/{id}:
 *   get:
 *     summary: Buscar detalhes de um tour específico
 *     tags: [Visitors]
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
  const visitorId = req.user.id;

  // Buscar detalhes do tour
  const tour = await Tour.findById(tourId);
  if (!tour) {
    throw AppError.tourNotFound(tourId);
  }

  // Verificar se já reservou este tour
  const alreadyBooked = await Booking.checkExistingBooking(tourId, visitorId);

  const tourData = {
    ...tour.toJSON(),
    formattedDate: tour.getFormattedDate(),
    relativeDate: tour.getRelativeDate(),
    isPast: tour.isPast(),
    isFullyBooked: tour.isFullyBooked(),
    already_booked: alreadyBooked
  };

  ApiResponse.success(res, tourData, 'Tour encontrado');
});

/**
 * @swagger
 * /api/visitor/tours/{id}/book:
 *   post:
 *     summary: Reservar um tour
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: Observações da reserva
 *     responses:
 *       201:
 *         description: Tour reservado com sucesso
 *       400:
 *         description: Tour não disponível para reserva
 *       409:
 *         description: Tour já reservado ou lotado
 */
exports.bookTour = catchAsync(async (req, res) => {
  const tourId = req.params.id;
  const visitorId = req.user.id;
  const { notes } = req.body;

  logger.business('Tour booking attempt', { visitorId, tourId });

  // Reservar tour
  const bookingId = await TourService.bookTour(tourId, visitorId, notes);
  const booking = await Booking.findById(bookingId);

  logger.business('Tour booked successfully', { visitorId, tourId, bookingId });

  ApiResponse.created(res, booking.toJSON(), 'Tour reservado com sucesso');
});

/**
 * @swagger
 * /api/visitor/bookings/{id}/cancel:
 *   post:
 *     summary: Cancelar reserva de um tour
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da reserva
 *     responses:
 *       200:
 *         description: Reserva cancelada com sucesso
 *       404:
 *         description: Reserva não encontrada
 *       400:
 *         description: Reserva não pode ser cancelada
 */
exports.cancelBooking = catchAsync(async (req, res) => {
  const bookingId = req.params.id;
  const visitorId = req.user.id;

  logger.business('Booking cancellation attempt', { visitorId, bookingId });

  // Cancelar reserva
  await TourService.cancelBooking(bookingId, visitorId);

  logger.business('Booking cancelled successfully', { visitorId, bookingId });

  ApiResponse.deleted(res, 'Reserva cancelada com sucesso');
});

/**
 * @swagger
 * /api/visitor/bookings:
 *   get:
 *     summary: Listar reservas do visitante
 *     tags: [Visitors]
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
 *           enum: [upcoming, past, cancelled, all]
 *           default: all
 *     responses:
 *       200:
 *         description: Reservas recuperadas com sucesso
 */
exports.getBookings = catchAsync(async (req, res) => {
  const visitorId = req.user.id;
  const { page = 1, limit = 10, status = 'all' } = req.query;
  const offset = (page - 1) * limit;

  let bookings;
  let total;

  if (status === 'upcoming') {
    bookings = await Booking.findUpcomingByVisitorId(visitorId, { limit: parseInt(limit), offset: parseInt(offset) });
    total = await Booking.countUpcomingByVisitorId(visitorId);
  } else {
    const filters = { visitor_id: visitorId };
    if (status !== 'all') {
      if (status === 'past') {
        filters.past = true;
      } else {
        filters.status = status;
      }
    }
    
    bookings = await Booking.findWithFilters(filters, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      orderBy: 'created_at',
      orderDirection: 'desc'
    });
    
    total = await Booking.count(filters);
  }

  const pagination = createPaginationMeta(page, limit, total);

  ApiResponse.paginated(res, bookings.map(booking => ({
    ...booking.toJSON(),
    formattedDate: booking.getFormattedDate?.() || new Date(booking.tour_date).toLocaleDateString('pt-BR')
  })), pagination);
});

/**
 * @swagger
 * /api/visitor/messages:
 *   get:
 *     summary: Buscar mensagens do visitante
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mensagens recuperadas com sucesso
 */
exports.getMessages = catchAsync(async (req, res) => {
  const visitorId = req.user.id;

  // Buscar mensagens do Visitor
  const messageData = await MessageService.getVisitorMessages(visitorId);

  // Buscar o Visitor para obter o nome do Angel
  const visitor = await Visitor.findByIdWithAngelDetails(visitorId);
  if (!visitor) {
    throw AppError.visitorNotFound(visitorId);
  }

  ApiResponse.success(res, {
    ...messageData,
    angelId: visitor.angel_id,
    angelName: visitor.angel_name
  }, 'Mensagens carregadas com sucesso');
});

/**
 * @swagger
 * /api/visitor/messages:
 *   post:
 *     summary: Enviar mensagem para o guia
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: Mensagem enviada com sucesso
 */
exports.sendMessage = catchAsync(async (req, res) => {
  const visitorId = req.user.id;
  const { content } = req.body;

  // Validar entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.fromValidationErrors(res, errors);
  }

  logger.business('Message sent by visitor', { visitorId });

  // Enviar mensagem
  const messageId = await MessageService.sendVisitorMessage(visitorId, content);

  ApiResponse.created(res, { messageId }, 'Mensagem enviada com sucesso');
});

/**
 * @swagger
 * /api/visitor/tours/{id}/review:
 *   post:
 *     summary: Avaliar um tour após a realização
 *     tags: [Visitors]
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
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       201:
 *         description: Avaliação enviada com sucesso
 *       400:
 *         description: Tour não pode ser avaliado
 *       409:
 *         description: Tour já foi avaliado
 */
exports.rateTour = catchAsync(async (req, res) => {
  const tourId = req.params.id;
  const visitorId = req.user.id;
  const { rating, comment } = req.body;

  // Validar entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.fromValidationErrors(res, errors);
  }

  logger.business('Tour rating attempt', { visitorId, tourId, rating });

  // Avaliar tour
  const reviewId = await TourService.rateTour(tourId, visitorId, rating, comment);

  logger.business('Tour rated successfully', { visitorId, tourId, reviewId, rating });

  ApiResponse.created(res, { reviewId }, 'Avaliação enviada com sucesso');
});

/**
 * @swagger
 * /api/visitor/stats:
 *   get:
 *     summary: Buscar estatísticas do visitante
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas recuperadas com sucesso
 */
exports.getStats = catchAsync(async (req, res) => {
  const visitorId = req.user.id;

  // Buscar estatísticas do visitante
  const stats = await Visitor.getVisitorStats(visitorId);

  ApiResponse.success(res, stats, 'Estatísticas carregadas com sucesso');
});