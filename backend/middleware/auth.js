const jwt = require('jsonwebtoken');

// Middleware para verificar se o usuário está autenticado
exports.isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Não autorizado. Token de autenticação não fornecido.'
      });
    }
    
    const token = authHeader.slice(7); // Remove 'Bearer ' do token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'aa9c82821247579e02f7c6af1236820c9d8a3f2ebf85268f5cdaf76853457');
    
    // Adicionar dados do usuário à requisição
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      userType: decoded.userType
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado.'
    });
  }
};

// Middleware para verificar se o usuário é um Angel
exports.isAngel = (req, res, next) => {
  if (req.user.userType !== 'angel') {
    return res.status(403).json({
      success: false,
      message: 'Acesso restrito a guias turísticos'
    });
  }
  next();
};

// Middleware para verificar se o usuário é um Visitor
exports.isVisitor = (req, res, next) => {
  if (req.user.userType !== 'visitor') {
    return res.status(403).json({
      success: false,
      message: 'Acesso restrito a visitantes'
    });
  }
  next();
};

// Middleware para verificar se um Angel tem permissão para uma operação específica
exports.checkAngelPermission = (req, res, next) => {
  const resourceId = parseInt(req.params.angelId || req.body.angelId || req.params.id);
  
  if (req.user.userType === 'angel' && req.user.id === resourceId) {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Você não tem permissão para esta operação'
  });
};

// Middleware para verificar se um Visitor tem permissão para uma operação específica
exports.checkVisitorPermission = (req, res, next) => {
  const resourceId = parseInt(req.params.visitorId || req.body.visitorId || req.params.id);
  
  if (req.user.userType === 'visitor' && req.user.id === resourceId) {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Você não tem permissão para esta operação'
  });
};