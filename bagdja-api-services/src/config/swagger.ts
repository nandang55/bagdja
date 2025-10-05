export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Bagdja Marketplace API',
    version: '1.0.0',
    description: 'Microservices API for Bagdja Marketplace - A secure 3-layer architecture demonstrating JWT authentication, role-based access control, and owner isolation.',
    contact: {
      name: 'Bagdja Team',
      email: 'support@bagdja.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server'
    },
    {
      url: 'https://bagdja-api-services.vercel.app',
      description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token from Supabase Auth'
      }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Error Type'
          },
          message: {
            type: 'string',
            example: 'Detailed error message'
          }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com'
          },
          fullName: {
            type: 'string',
            example: 'John Doe'
          },
          role: {
            type: 'string',
            enum: ['Buyer', 'Developer', 'Admin'],
            example: 'Developer'
          },
          avatarUrl: {
            type: 'string',
            format: 'uri',
            example: 'https://example.com/avatar.jpg'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Category: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid'
          },
          name: {
            type: 'string',
            example: 'Electronics'
          },
          slug: {
            type: 'string',
            example: 'electronics'
          },
          description: {
            type: 'string',
            example: 'Gadgets and tech accessories'
          },
          isActive: {
            type: 'boolean'
          }
        }
      },
      Product: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid'
          },
          ownerId: {
            type: 'string',
            format: 'uuid'
          },
          categoryId: {
            type: 'string',
            format: 'uuid'
          },
          name: {
            type: 'string',
            example: 'Wireless Headphones'
          },
          slug: {
            type: 'string',
            example: 'wireless-headphones'
          },
          description: {
            type: 'string',
            example: 'Premium wireless headphones with noise cancellation'
          },
          price: {
            type: 'number',
            format: 'float',
            example: 99.99
          },
          stock: {
            type: 'integer',
            example: 50
          },
          imageUrl: {
            type: 'string',
            format: 'uri'
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uri'
            }
          },
          status: {
            type: 'string',
            enum: ['draft', 'published', 'archived'],
            example: 'published'
          },
          isFeatured: {
            type: 'boolean'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      ProductInput: {
        type: 'object',
        required: ['name', 'slug', 'price', 'categoryId'],
        properties: {
          name: {
            type: 'string',
            example: 'Wireless Headphones'
          },
          slug: {
            type: 'string',
            example: 'wireless-headphones'
          },
          description: {
            type: 'string',
            example: 'Premium wireless headphones'
          },
          price: {
            type: 'number',
            format: 'float',
            example: 99.99
          },
          stock: {
            type: 'integer',
            example: 50
          },
          categoryId: {
            type: 'string',
            format: 'uuid'
          },
          imageUrl: {
            type: 'string',
            format: 'uri'
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uri'
            }
          },
          status: {
            type: 'string',
            enum: ['draft', 'published', 'archived'],
            default: 'draft'
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Health',
      description: 'API health check endpoints'
    },
    {
      name: 'Auth',
      description: 'Authentication and authorization endpoints'
    },
    {
      name: 'Products (Public)',
      description: 'Public product browsing endpoints'
    },
    {
      name: 'Products (Developer)',
      description: 'Protected product management endpoints (Developer role required)'
    },
    {
      name: 'Categories',
      description: 'Product categories endpoints'
    }
  ]
};

export const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/server.ts', './src/services/*.ts']
};

