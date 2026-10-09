export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'CodeArena API Documentation',
    version: '1.0.0',
    description: 'Detailed interactive API documentation for CodeArena platforms. Authentication requires a Native JWT Access Token or Guest Token.',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1 Base URL',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your Native JWT Access Token or Guest Session JWT token.',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
          username: { type: 'string', example: 'johndoe' },
          displayName: { type: 'string', example: 'John Doe' },
          avatar: { type: 'string', example: 'https://api.dicebear.com/7.x/bottts/svg?seed=johndoe' },
          wins: { type: 'integer', example: 10 },
          losses: { type: 'integer', example: 5 },
          matchesPlayed: { type: 'integer', example: 15 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Question: {
        type: 'object',
        properties: {
          questionId: { type: 'string', example: 'q_js_001' },
          topic: { type: 'string', example: 'javascript' },
          difficulty: { type: 'string', example: 'easy' },
          question: { type: 'string', example: 'What is the output of typeof null in JavaScript?' },
          options: {
            type: 'array',
            items: { type: 'string' },
            example: ['object', 'null', 'undefined', 'boolean'],
          },
          explanation: { type: 'string', example: 'typeof null returns object due to legacy implementation.' },
        },
      },
      Room: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109cc' },
          roomCode: { type: 'string', example: 'AB7XQ2' },
          hostId: { type: 'string', example: '60d0fe4f5311236168a109ca' },
          players: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                userId: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                isHost: { type: 'boolean', example: true },
                isReady: { type: 'boolean', example: false },
              },
            },
          },
          settings: {
            type: 'object',
            properties: {
              topic: { type: 'string', example: 'Arrays' },
              difficulty: { type: 'string', example: 'Medium' },
              duration: { type: 'integer', example: 30 },
            },
          },
          maxPlayers: { type: 'integer', example: 2 },
          status: { type: 'string', example: 'WAITING' },
          matchId: { type: 'string', nullable: true, example: null },
        },
      },
      Battle: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109cd' },
          roomId: { type: 'string', example: '60d0fe4f5311236168a109cc' },
          roomCode: { type: 'string', example: 'AB7XQ2' },
          topic: { type: 'string', example: 'javascript' },
          difficulty: { type: 'string', example: 'easy' },
          questionCount: { type: 'integer', example: 5 },
          timePerQuestion: { type: 'integer', example: 30 },
          winnerId: { type: 'string', nullable: true, example: null },
          isDraw: { type: 'boolean', example: false },
          status: { type: 'string', example: 'IN_PROGRESS' },
          startedAt: { type: 'string', format: 'date-time' },
          endedAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  paths: {
    '/users/me': {
      get: {
        summary: 'Get Current User Profile',
        tags: ['Users'],
        responses: {
          200: {
            description: 'Logged in user profile retrieved.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
        },
      },
      patch: {
        summary: 'Update Profile',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  displayName: { type: 'string', example: 'John' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'User profile updated.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/users/{username}': {
      get: {
        summary: 'Get Public Profile',
        tags: ['Users'],
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'johndoe',
          },
        ],
        responses: {
          200: {
            description: 'Public profile stats retrieved.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        username: { type: 'string' },
                        displayName: { type: 'string' },
                        avatar: { type: 'string' },
                        wins: { type: 'integer' },
                        losses: { type: 'integer' },
                        matchesPlayed: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/questions': {
      get: {
        summary: 'List Questions',
        tags: ['Questions'],
        parameters: [
          { name: 'topic', in: 'query', schema: { type: 'string' } },
          { name: 'difficulty', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'List of published MCQ questions.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Question' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/rooms': {
      post: {
        summary: 'Create Room',
        tags: ['Rooms'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  topic: { type: 'string', example: 'Arrays' },
                  difficulty: { type: 'string', example: 'Medium' },
                  duration: { type: 'integer', example: 30 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Room created. Return details with code.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Room' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/rooms/join': {
      post: {
        summary: 'Join Room',
        tags: ['Rooms'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['roomCode'],
                properties: {
                  roomCode: { type: 'string', example: 'AB7XQ2' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Successfully joined room.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Room' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/rooms/{roomCode}': {
      get: {
        summary: 'Get Room Details',
        tags: ['Rooms'],
        parameters: [
          { name: 'roomCode', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Room information.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Room' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/rooms/{roomCode}/ready': {
      patch: {
        summary: 'Update Ready Status',
        tags: ['Rooms'],
        parameters: [
          { name: 'roomCode', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['isReady'],
                properties: {
                  isReady: { type: 'boolean', example: true },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Ready status updated.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Room' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/rooms/{roomCode}/settings': {
      patch: {
        summary: 'Update Room Settings (Host Only)',
        tags: ['Rooms'],
        parameters: [
          { name: 'roomCode', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  topic: { type: 'string', example: 'Recursion' },
                  difficulty: { type: 'string', example: 'Hard' },
                  duration: { type: 'integer', example: 45 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Room settings updated.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Room' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/rooms/{roomCode}/leave': {
      post: {
        summary: 'Leave Room',
        tags: ['Rooms'],
        parameters: [
          { name: 'roomCode', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Left the room successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/battles/start': {
      post: {
        summary: 'Start Battle (Host Only)',
        tags: ['Battles'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['roomCode'],
                properties: {
                  roomCode: { type: 'string', example: 'AB7XQ2' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Battle started, questions assigned, and socket events broadcast.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        battleId: { type: 'string' },
                        roomCode: { type: 'string' },
                        status: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/history': {
      get: {
        summary: 'Get Battle History',
        tags: ['History'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: {
            description: 'Paginated user battle history list.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        matches: { type: 'array', items: { type: 'object' } },
                        total: { type: 'integer' },
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/history/{battleId}': {
      get: {
        summary: 'Get Battle Results Breakdown',
        tags: ['History'],
        parameters: [
          { name: 'battleId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Detailed question-by-question battle results report.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'object' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
export default openApiSpec;
