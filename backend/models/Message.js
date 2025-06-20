const knex = require('../db');
const moment = require('moment');

class Message {
  constructor(data) {
    this.id = data.id;
    this.sender_type = data.sender_type;
    this.sender_id = data.sender_id;
    this.receiver_type = data.receiver_type;
    this.receiver_id = data.receiver_id;
    this.content = data.content;
    this.read = data.read || false;
    this.created_at = data.created_at;
    
    // Propriedades adicionais de joins
    this.sender_name = data.sender_name;
    this.receiver_name = data.receiver_name;
  }

  // Formatar data para exibição
  getFormattedDate() {
    return moment(this.created_at).format('DD/MM/YYYY HH:mm');
  }

  // Verificar se a mensagem é de um Angel específico
  isFromAngel(angelId) {
    return this.sender_type === 'angel' && this.sender_id === angelId;
  }

  // Verificar se a mensagem é de um Visitor específico
  isFromVisitor(visitorId) {
    return this.sender_type === 'visitor' && this.sender_id === visitorId;
  }

  // Buscar mensagens de uma conversa entre Angel e Visitor
  static async findConversation(angelId, visitorId) {
    const messages = await knex('messages')
      .select(
        'messages.*',
        knex.raw(`
          CASE
            WHEN messages.sender_type = 'visitor' THEN visitors.name
            ELSE angels.name
          END as sender_name
        `),
        knex.raw(`
          CASE
            WHEN messages.receiver_type = 'visitor' THEN visitors.name
            ELSE angels.name
          END as receiver_name
        `)
      )
      .leftJoin(
        'visitors',
        function() {
          this.on(function() {
            this.on('messages.sender_type', '=', knex.raw("'visitor'"))
              .andOn('messages.sender_id', '=', 'visitors.id');
          }).orOn(function() {
            this.on('messages.receiver_type', '=', knex.raw("'visitor'"))
              .andOn('messages.receiver_id', '=', 'visitors.id');
          });
        }
      )
      .leftJoin(
        'angels',
        function() {
          this.on(function() {
            this.on('messages.sender_type', '=', knex.raw("'angel'"))
              .andOn('messages.sender_id', '=', 'angels.id');
          }).orOn(function() {
            this.on('messages.receiver_type', '=', knex.raw("'angel'"))
              .andOn('messages.receiver_id', '=', 'angels.id');
          });
        }
      )
      .where(function() {
        this.where(function() {
          this.where('messages.sender_id', angelId)
            .where('messages.sender_type', 'angel')
            .where('messages.receiver_id', visitorId)
            .where('messages.receiver_type', 'visitor');
        }).orWhere(function() {
          this.where('messages.sender_id', visitorId)
            .where('messages.sender_type', 'visitor')
            .where('messages.receiver_id', angelId)
            .where('messages.receiver_type', 'angel');
        });
      })
      .orderBy('messages.created_at', 'asc');
    
    return messages.map(message => new Message(message));
  }

  // Buscar todas as mensagens de um Angel
  static async findByAngelId(angelId) {
    const messages = await knex('messages')
      .select(
        'messages.*',
        knex.raw(`
          CASE
            WHEN messages.sender_type = 'visitor' THEN visitors.name
            ELSE angels.name
          END as sender_name
        `),
        knex.raw(`
          CASE
            WHEN messages.receiver_type = 'visitor' THEN visitors.name
            ELSE angels.name
          END as receiver_name
        `)
      )
      .leftJoin(
        'visitors',
        function() {
          this.on(function() {
            this.on('messages.sender_type', '=', knex.raw("'visitor'"))
              .andOn('messages.sender_id', '=', 'visitors.id');
          }).orOn(function() {
            this.on('messages.receiver_type', '=', knex.raw("'visitor'"))
              .andOn('messages.receiver_id', '=', 'visitors.id');
          });
        }
      )
      .leftJoin(
        'angels',
        function() {
          this.on(function() {
            this.on('messages.sender_type', '=', knex.raw("'angel'"))
              .andOn('messages.sender_id', '=', 'angels.id');
          }).orOn(function() {
            this.on('messages.receiver_type', '=', knex.raw("'angel'"))
              .andOn('messages.receiver_id', '=', 'angels.id');
          });
        }
      )
      .where(function() {
        this.where('messages.sender_id', angelId)
          .where('messages.sender_type', 'angel')
          .orWhere(function() {
            this.where('messages.receiver_id', angelId)
              .where('messages.receiver_type', 'angel');
          });
      })
      .orderBy('messages.created_at', 'desc');
    
    return messages.map(message => new Message(message));
  }

  // Buscar todas as mensagens de um Visitor
  static async findByVisitorId(visitorId) {
    const messages = await knex('messages')
      .select(
        'messages.*',
        knex.raw(`
          CASE
            WHEN messages.sender_type = 'visitor' THEN visitors.name
            ELSE angels.name
          END as sender_name
        `),
        knex.raw(`
          CASE
            WHEN messages.receiver_type = 'visitor' THEN visitors.name
            ELSE angels.name
          END as receiver_name
        `)
      )
      .leftJoin(
        'visitors',
        function() {
          this.on(function() {
            this.on('messages.sender_type', '=', knex.raw("'visitor'"))
              .andOn('messages.sender_id', '=', 'visitors.id');
          }).orOn(function() {
            this.on('messages.receiver_type', '=', knex.raw("'visitor'"))
              .andOn('messages.receiver_id', '=', 'visitors.id');
          });
        }
      )
      .leftJoin(
        'angels',
        function() {
          this.on(function() {
            this.on('messages.sender_type', '=', knex.raw("'angel'"))
              .andOn('messages.sender_id', '=', 'angels.id');
          }).orOn(function() {
            this.on('messages.receiver_type', '=', knex.raw("'angel'"))
              .andOn('messages.receiver_id', '=', 'angels.id');
          });
        }
      )
      .where(function() {
        this.where('messages.sender_id', visitorId)
          .where('messages.sender_type', 'visitor')
          .orWhere(function() {
            this.where('messages.receiver_id', visitorId)
              .where('messages.receiver_type', 'visitor');
          });
      })
      .orderBy('messages.created_at', 'asc');
    
    return messages.map(message => new Message(message));
  }

  // Contar mensagens não lidas
  static async countUnread(receiverId, receiverType) {
    const result = await knex('messages')
      .count('* as count')
      .where('receiver_id', receiverId)
      .where('receiver_type', receiverType)
      .where('read', false)
      .first();
    
    return result ? result.count : 0;
  }

  // Marcar mensagens como lidas
  static async markAsRead(receiverId, receiverType) {
    const updated = await knex('messages')
      .where('receiver_id', receiverId)
      .where('receiver_type', receiverType)
      .where('read', false)
      .update({ read: true });
    
    return updated;
  }

  // Enviar mensagem
  static async send(senderType, senderId, receiverType, receiverId, content) {
    const [id] = await knex('messages')
      .insert({
        sender_type: senderType,
        sender_id: senderId,
        receiver_type: receiverType,
        receiver_id: receiverId,
        content: content,
        read: false
      });
    
    return id;
  }
}

module.exports = Message;