const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.1.0', // Versão correta do OpenAPI
    info: {
      title: 'MyBestAngel API',
      version: '1.0.0',
      description: `
        API REST para a plataforma de turismo MyBestAngel.
        
        Esta API conecta guias turísticos (Angels) com visitantes, oferecendo:
        - Sistema de autenticação com JWT
        - Gestão de tours e reservas
        - Sistema de mensagens
        - Avaliações e reviews
        - Dashboard com analytics
        
        **Desenvolvida para a COP30 em Belém do Pará**
      `,
      contact: {
        name: 'MyBestAngel Team',
        email: 'api@mybestangel.com',
        url: 'https://mybestangel.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    externalDocs: {
      description: 'Documentação completa do projeto',
      url: 'https://github.com/caique-rabelo/mybestangel-api'
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api.mybestangel.com',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido através do endpoint de login'
        }
      },
      schemas: {
        // Schema para resposta de sucesso
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operação realizada com sucesso'
            },
            data: {
              type: 'object',
              description: 'Dados da resposta'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-06-19T10:30:00.000Z'
            }
          },
          required: ['success', 'message', 'timestamp']
        },
        
        // Schema para resposta de erro
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Erro na operação'
                },
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR'
                },
                details: {
                  type: 'object',
                  description: 'Detalhes adicionais do erro'
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time'
                }
              },
              required: ['message', 'timestamp']
            }
          },
          required: ['success', 'error']
        },

        // Schema para Angel
        Angel: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@example.com'
            },
            phone: {
              type: 'string',
              example: '(91) 99999-9999'
            },
            bio: {
              type: 'string',
              example: 'Guia turístico experiente em Belém'
            },
            languages: {
              type: 'string',
              example: 'Português, Inglês, Espanhol'
            },
            specialty: {
              type: 'string',
              example: 'Gastronomia e Cultura'
            },
            rating: {
              type: 'number',
              format: 'float',
              minimum: 0,
              maximum: 5,
              example: 4.8
            },
            reviews_count: {
              type: 'integer',
              example: 25
            },
            profile_image: {
              type: 'string',
              example: 'https://example.com/profile.jpg'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            updated_at: {
              type: 'string',
              format: 'date-time'
            }
          },
          required: ['id', 'name', 'email']
        },

        // Schema para Visitor
        Visitor: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            angel_id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'Maria Santos'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'maria@example.com'
            },
            phone: {
              type: 'string',
              example: '(11) 99999-9999'
            },
            nationality: {
              type: 'string',
              example: 'Brasil'
            },
            language_preference: {
              type: 'string',
              example: 'Português'
            },
            profile_image: {
              type: 'string',
              example: 'https://example.com/profile.jpg'
            },
            angel_name: {
              type: 'string',
              example: 'João Silva'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            updated_at: {
              type: 'string',
              format: 'date-time'
            }
          },
          required: ['id', 'angel_id', 'name', 'email']
        },

        // Schema para Tour
        Tour: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            angel_id: {
              type: 'integer',
              example: 1
            },
            title: {
              type: 'string',
              example: 'Mercado Ver-o-Peso'
            },
            description: {
              type: 'string',
              example: 'Visita ao tradicional mercado Ver-o-Peso'
            },
            location: {
              type: 'string',
              example: 'Ver-o-Peso, Belém, PA'
            },
            date: {
              type: 'string',
              format: 'date-time',
              example: '2025-06-25T09:00:00.000Z'
            },
            duration: {
              type: 'integer',
              description: 'Duração em minutos',
              example: 180
            },
            price: {
              type: 'number',
              format: 'float',
              example: 50.00
            },
            max_participants: {
              type: 'integer',
              example: 8
            },
            current_participants: {
              type: 'integer',
              example: 3
            },
            image: {
              type: 'string',
              example: 'https://example.com/tour.jpg'
            },
            angel_name: {
              type: 'string',
              example: 'João Silva'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            updated_at: {
              type: 'string',
              format: 'date-time'
            }
          },
          required: ['id', 'angel_id', 'title', 'location', 'date']
        },

        // Schema para inputs
        LoginInput: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            },
            userType: {
              type: 'string',
              enum: ['angel', 'visitor'],
              example: 'angel'
            }
          },
          required: ['email', 'password', 'userType']
        },

        RegisterAngelInput: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 3,
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            },
            confirmPassword: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            },
            phone: {
              type: 'string',
              example: '(91) 99999-9999'
            },
            bio: {
              type: 'string',
              example: 'Guia turístico experiente'
            },
            languages: {
              type: 'string',
              example: 'Português, Inglês'
            },
            specialty: {
              type: 'string',
              example: 'Cultura e História'
            }
          },
          required: ['name', 'email', 'password', 'confirmPassword', 'phone']
        },

        RegisterVisitorInput: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 3,
              example: 'Maria Santos'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'maria@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            },
            confirmPassword: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            },
            angelId: {
              type: 'integer',
              example: 1
            },
            phone: {
              type: 'string',
              example: '(11) 99999-9999'
            },
            nationality: {
              type: 'string',
              example: 'Brasil'
            },
            languagePreference: {
              type: 'string',
              example: 'Português'
            }
          },
          required: ['name', 'email', 'password', 'confirmPassword', 'angelId']
        },

        TourInput: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 5,
              maxLength: 100,
              example: 'Mercado Ver-o-Peso'
            },
            description: {
              type: 'string',
              example: 'Visita ao tradicional mercado Ver-o-Peso'
            },
            location: {
              type: 'string',
              example: 'Ver-o-Peso, Belém, PA'
            },
            date: {
              type: 'string',
              format: 'date',
              example: '2025-06-25'
            },
            time: {
              type: 'string',
              pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
              example: '09:00'
            },
            duration: {
              type: 'integer',
              minimum: 15,
              maximum: 480,
              example: 180
            },
            price: {
              type: 'number',
              format: 'float',
              minimum: 0,
              example: 50.00
            },
            maxParticipants: {
              type: 'integer',
              minimum: 1,
              maximum: 50,
              example: 8
            }
          },
          required: ['title', 'location', 'date', 'time']
        },

        ReviewInput: {
          type: 'object',
          properties: {
            rating: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              example: 5
            },
            comment: {
              type: 'string',
              maxLength: 500,
              example: 'Excelente tour! Muito bem organizado.'
            }
          },
          required: ['rating']
        }
      },
      responses: {
        ValidationError: {
          description: 'Erro de validação',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ErrorResponse' },
                  {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'object',
                        properties: {
                          code: {
                            type: 'string',
                            example: 'VALIDATION_ERROR'
                          },
                          details: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                field: {
                                  type: 'string',
                                  example: 'email'
                                },
                                message: {
                                  type: 'string',
                                  example: 'Email é obrigatório'
                                },
                                value: {
                                  type: 'string',
                                  example: 'invalid-email'
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        Unauthorized: {
          description: 'Não autorizado',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ErrorResponse' },
                  {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'object',
                        properties: {
                          code: {
                            type: 'string',
                            example: 'UNAUTHORIZED'
                          },
                          message: {
                            type: 'string',
                            example: 'Token inválido ou expirado'
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Operações de autenticação e registro'
      },
      {
        name: 'Angels',
        description: 'Operações relacionadas aos guias turísticos'
      },
      {
        name: 'Visitors',
        description: 'Operações relacionadas aos visitantes'
      },
      {
        name: 'Tours',
        description: 'Operações relacionadas aos tours'
      }
    ]
  },
  apis: [
    './controllers/*.js', // Ler documentação dos controllers
    './routes/*.js'       // Ler documentação das rotas
  ]
};

// Gerar specs do swagger
const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  options
};