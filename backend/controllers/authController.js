const AuthService = require('../services/AuthService');
const Angel = require('../models/Angel');
const { catchAsync } = require('../middleware/errorHandler');
const { ApiResponse } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Operações de autenticação e registro
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *           example:
 *             email: "guia@mybestangel.com"
 *             password: "admin123"
 *             userType: "angel"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             email:
 *                               type: string
 *                         userType:
 *                           type: string
 *                           enum: [angel, visitor]
 *                         token:
 *                           type: string
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.login = catchAsync(async (req, res) => {
  const { email, password, userType } = req.body;

  // Validar entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.fromValidationErrors(res, errors);
  }

  logger.auth('Login attempt', { email, userType, ip: req.ip });

  try {
    // Realizar login
    const authData = await AuthService.login(email, password, userType);

    logger.auth('Login successful', { 
      userId: authData.user.id, 
      userType: authData.userType,
      ip: req.ip 
    });

    ApiResponse.success(res, authData, 'Login realizado com sucesso');
  } catch (error) {
    logger.auth('Login failed', { 
      email, 
      userType, 
      error: error.message,
      ip: req.ip 
    });
    
    throw AppError.invalidCredentials();
  }
});

/**
 * @swagger
 * /api/auth/register/angel:
 *   post:
 *     summary: Registrar novo guia turístico
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterAngelInput'
 *           example:
 *             name: "João Silva"
 *             email: "joao@example.com"
 *             password: "123456"
 *             confirmPassword: "123456"
 *             phone: "(91) 99999-9999"
 *             bio: "Guia turístico experiente em Belém"
 *             languages: "Português, Inglês"
 *             specialty: "Cultura e História"
 *     responses:
 *       201:
 *         description: Guia registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           type: object
 *                         userType:
 *                           type: string
 *                         token:
 *                           type: string
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Email já está em uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.registerAngel = catchAsync(async (req, res) => {
  // Validar entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.fromValidationErrors(res, errors);
  }

  const { email, name } = req.body;

  logger.auth('Angel registration attempt', { 
    email, 
    name,
    ip: req.ip 
  });

  try {
    // Realizar registro
    const authData = await AuthService.registerAngel(req.body);

    logger.auth('Angel registration successful', { 
      userId: authData.user.id,
      email,
      name,
      ip: req.ip 
    });

    ApiResponse.created(res, authData, 'Guia registrado com sucesso');
  } catch (error) {
    logger.auth('Angel registration failed', { 
      email, 
      name,
      error: error.message,
      ip: req.ip 
    });
    
    if (error.message.includes('já está em uso')) {
      throw AppError.emailAlreadyExists(email);
    }
    
    throw error;
  }
});

/**
 * @swagger
 * /api/auth/register/visitor:
 *   post:
 *     summary: Registrar novo visitante
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterVisitorInput'
 *           example:
 *             name: "Maria Santos"
 *             email: "maria@example.com"
 *             password: "123456"
 *             confirmPassword: "123456"
 *             angelId: 1
 *             phone: "(11) 99999-9999"
 *             nationality: "Brasil"
 *             languagePreference: "Português"
 *     responses:
 *       201:
 *         description: Visitante registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           type: object
 *                         userType:
 *                           type: string
 *                         token:
 *                           type: string
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Email já está em uso ou guia não disponível
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.registerVisitor = catchAsync(async (req, res) => {
  // Validar entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.fromValidationErrors(res, errors);
  }

  const { email, name, angelId } = req.body;

  logger.auth('Visitor registration attempt', { 
    email, 
    name,
    angelId,
    ip: req.ip 
  });

  try {
    // Realizar registro
    const authData = await AuthService.registerVisitor(req.body);

    logger.auth('Visitor registration successful', { 
      userId: authData.user.id,
      email,
      name,
      angelId,
      ip: req.ip 
    });

    ApiResponse.created(res, authData, 'Visitante registrado com sucesso');
  } catch (error) {
    logger.auth('Visitor registration failed', { 
      email, 
      name,
      angelId,
      error: error.message,
      ip: req.ip 
    });
    
    if (error.message.includes('já está em uso')) {
      throw AppError.emailAlreadyExists(email);
    }
    
    if (error.message.includes('não tem vagas')) {
      throw AppError.angelNotAvailable(angelId);
    }
    
    throw error;
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obter dados do usuário autenticado
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           oneOf:
 *                             - $ref: '#/components/schemas/Angel'
 *                             - $ref: '#/components/schemas/Visitor'
 *                         userType:
 *                           type: string
 *                           enum: [angel, visitor]
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
exports.me = catchAsync(async (req, res) => {
  const { id, userType } = req.user;

  let user;
  if (userType === 'angel') {
    user = await Angel.findById(id);
  } else {
    const Visitor = require('../models/Visitor');
    user = await Visitor.findByIdWithAngelDetails(id);
  }

  if (!user) {
    throw AppError.notFound('Usuário não encontrado');
  }

  ApiResponse.success(res, {
    user: user.toJSON(),
    userType
  }, 'Dados do usuário recuperados');
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renovar token de acesso
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token renovado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                         expiresIn:
 *                           type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
exports.refresh = catchAsync(async (req, res) => {
  const { id, email, name, userType } = req.user;

  // Gerar novo token
  const token = AuthService.generateToken({ id, email, name }, userType);

  logger.auth('Token refreshed', { userId: id, userType, ip: req.ip });

  ApiResponse.success(res, {
    token,
    expiresIn: '24h'
  }, 'Token renovado com sucesso');
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Fazer logout
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
exports.logout = catchAsync(async (req, res) => {
  const { id, userType } = req.user;

  logger.auth('User logout', { userId: id, userType, ip: req.ip });

  // Em uma implementação real, você poderia invalidar o token aqui
  // Por exemplo, adicionando-o a uma blacklist

  ApiResponse.success(res, null, 'Logout realizado com sucesso');
});

/**
 * @swagger
 * /api/auth/available-angels:
 *   get:
 *     summary: Listar guias disponíveis para afiliação
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: specialty
 *         schema:
 *           type: string
 *         description: Filtrar por especialidade
 *       - in: query
 *         name: languages
 *         schema:
 *           type: string
 *         description: Filtrar por idiomas
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *           format: float
 *         description: Rating mínimo
 *     responses:
 *       200:
 *         description: Lista de guias disponíveis
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           specialty:
 *                             type: string
 *                           languages:
 *                             type: string
 *                           bio:
 *                             type: string
 *                           rating:
 *                             type: number
 *                           reviews_count:
 *                             type: integer
 */
exports.getAvailableAngels = catchAsync(async (req, res) => {
  const { specialty, languages, minRating } = req.query;

  // Buscar Angels disponíveis com filtros
  const filters = {};
  if (specialty) filters.specialty = specialty;
  if (languages) filters.languages = languages;
  if (minRating) filters.minRating = parseFloat(minRating);

  const angels = await Angel.findAvailableForAffiliation(filters);

  ApiResponse.success(res, angels.map(angel => angel.toPublicJSON()), 'Guias disponíveis recuperados');
});

/**
 * @swagger
 * /api/auth/verify-token:
 *   get:
 *     summary: Verificar validade do token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         valid:
 *                           type: boolean
 *                         user:
 *                           type: object
 *                         userType:
 *                           type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
exports.verifyToken = catchAsync(async (req, res) => {
  const { id, email, name, userType } = req.user;

  ApiResponse.success(res, {
    valid: true,
    user: { id, email, name },
    userType
  }, 'Token válido');
});

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Alterar senha
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Senha atual
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 description: Nova senha
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmação da nova senha
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Senha atual incorreta ou senhas não coincidem
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
exports.changePassword = catchAsync(async (req, res) => {
  const { id, userType } = req.user;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Validar entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.fromValidationErrors(res, errors);
  }

  // Verificar se as novas senhas coincidem
  if (newPassword !== confirmPassword) {
    throw AppError.badRequest('As senhas não coincidem');
  }

  logger.auth('Password change attempt', { userId: id, userType, ip: req.ip });

  // Buscar usuário
  let user;
  if (userType === 'angel') {
    user = await Angel.findById(id);
  } else {
    const Visitor = require('../models/Visitor');
    user = await Visitor.findById(id);
  }

  if (!user) {
    throw AppError.notFound('Usuário não encontrado');
  }

  // Verificar senha atual
  const isCurrentPasswordValid = await user.verifyPassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw AppError.badRequest('Senha atual incorreta');
  }

  // Atualizar senha
  user.password = newPassword;
  await user.save();

  logger.auth('Password changed successfully', { userId: id, userType, ip: req.ip });

  ApiResponse.success(res, null, 'Senha alterada com sucesso');
});