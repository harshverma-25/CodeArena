export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'CodeArena API Documentation',
    version: '1.0.0',
    description: 'Detailed interactive API documentation for CodeArena platforms. Authentication requires a Clerk JWT.',
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
        description: 'Enter your Clerk Session JWT token.',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
          clerkId: { type: 'string', example: 'user_2Nn1uE9...' },
          username: { type: 'string', example: 'johndoe' },
          displayName: { type: 'string', example: 'John Doe' },
          avatar: { type: 'string', example: 'https://images.clerk.com/...' },
          wins: { type: 'integer', example: 10 },
          losses: { type: 'integer', example: 5 },
          matchesPlayed: { type: 'integer', example: 15 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Problem: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109cb' },
          title: { type: 'string', example: 'Two Sum' },
          slug: { type: 'string', example: 'two-sum' },
          topic: { type: 'string', example: 'Arrays' },
          difficulty: { type: 'string', example: 'Easy' },
          description: { type: 'string', example: 'Given an array of integers...' },
          inputFormat: { type: 'string', example: 'First line contains integer N...' },
          outputFormat: { type: 'string', example: 'Return indices of the two numbers...' },
          constraints: { type: 'string', example: '2 <= nums.length <= 10^4' },
          examples: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                input: { type: 'string', example: '[2,7,11,15]\n9' },
                output: { type: 'string', example: '[0,1]' },
                explanation: { type: 'string', example: 'Because nums[0] + nums[1] == 9...' },
              },
            },
          },
          starterCode: {
            type: 'object',
            additionalProperties: { type: 'string' },
            example: {
              javascript: 'function twoSum(nums, target) {\n  // Write code\n}',
              python: 'class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:',
            },
          },
          timeLimit: { type: 'integer', example: 2 },
          memoryLimit: { type: 'integer', example: 256 },
          points: { type: 'integer', example: 100 },
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
      Match: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109cd' },
          roomId: { type: 'string', example: '60d0fe4f5311236168a109cc' },
          problemId: { type: 'string', example: '60d0fe4f5311236168a109cb' },
          players: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                userId: { type: 'string', example: '60d0fe4f5311236168a109ca' },
              },
            },
          },
          winnerId: { type: 'string', nullable: true, example: null },
          status: { type: 'string', example: 'IN_PROGRESS' },
          startedAt: { type: 'string', format: 'date-time' },
          endedAt: { type: 'string', format: 'date-time', nullable: true },
          duration: { type: 'integer', example: 1800 },
        },
      },
      Submission: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109ce' },
          matchId: { type: 'string', example: '60d0fe4f5311236168a109cd' },
          userId: { type: 'string', example: '60d0fe4f5311236168a109ca' },
          submissionNumber: { type: 'integer', example: 1 },
          language: { type: 'string', example: 'javascript' },
          sourceCode: { type: 'string', example: 'function twoSum() {}' },
          verdict: { type: 'string', example: 'ACCEPTED' },
          executionTime: { type: 'integer', example: 45 },
          memoryUsed: { type: 'number', example: 12.4 },
          passedTestCases: { type: 'integer', example: 5 },
          totalTestCases: { type: 'integer', example: 5 },
          stdout: { type: 'string', nullable: true },
          stderr: { type: 'string', nullable: true },
          compileOutput: { type: 'string', nullable: true },
          isFinalAccepted: { type: 'boolean', example: true },
          submittedAt: { type: 'string', format: 'date-time' },
          judgedAt: { type: 'string', format: 'date-time', nullable: true },
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
                  preferredLanguage: { type: 'string', example: 'python' },
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
    '/problems': {
      get: {
        summary: 'List Problems',
        tags: ['Problems'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'topic', in: 'query', schema: { type: 'string' } },
          { name: 'difficulty', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'List of problems and total count.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        problems: { type: 'array', items: { $ref: '#/components/schemas/Problem' } },
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
    '/problems/{slug}': {
      get: {
        summary: 'Get Problem by Slug',
        tags: ['Problems'],
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Problem details (never exposes hidden cases).',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Problem' },
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
    '/matches/start': {
      post: {
        summary: 'Start Match (Host Only)',
        tags: ['Matches'],
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
            description: 'Match started, room transitioned, socket emitted.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        matchId: { type: 'string' },
                        duration: { type: 'integer' },
                        startedAt: { type: 'string' },
                        problem: {
                          type: 'object',
                          properties: {
                            _id: { type: 'string' },
                            title: { type: 'string' },
                            description: { type: 'string' },
                            examples: { type: 'array', items: { type: 'object' } },
                            constraints: { type: 'string' },
                            starterCode: { type: 'object' },
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
      },
    },
    '/matches/history': {
      get: {
        summary: 'Get Match History',
        tags: ['Matches'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: {
            description: 'Paginated user match history list.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        matches: { type: 'array', items: { $ref: '#/components/schemas/Match' } },
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
    '/matches/{matchId}': {
      get: {
        summary: 'Get Match Details',
        tags: ['Matches'],
        parameters: [
          { name: 'matchId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Match specifications.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Match' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/submissions': {
      post: {
        summary: 'Submit Code',
        tags: ['Submissions'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['matchId', 'language', 'sourceCode'],
                properties: {
                  matchId: { type: 'string', example: '60d0fe4f5311236168a109cd' },
                  language: { type: 'string', example: 'javascript' },
                  sourceCode: { type: 'string', example: 'function twoSum() { ... }' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Code executed on Judge0, result updated, socket emitted.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Submission' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/submissions/{submissionId}': {
      get: {
        summary: 'Get Submission Details',
        tags: ['Submissions'],
        parameters: [
          { name: 'submissionId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Sanitized submission outputs.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Submission' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/matches/{matchId}/submissions': {
      get: {
        summary: 'Get Match Submissions',
        tags: ['Submissions'],
        parameters: [
          { name: 'matchId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'List of all submissions associated with the match.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Submission' } },
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
