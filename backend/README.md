# CourtFlow Backend API

A standalone Express.js backend API service for the CourtFlow court performance dashboard application.

## Features

- **Express.js** with TypeScript
- **Prisma ORM** for database operations
- **Redis** for caching and session management
- **JWT Authentication** with refresh tokens
- **Rate Limiting** and security middleware
- **Comprehensive Logging** with Winston
- **Health Checks** and monitoring endpoints
- **OpenAPI/Swagger** documentation (coming soon)
- **Comprehensive Error Handling**
- **Request/Response Logging** with correlation IDs

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # HTTP request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic layer (coming soon)
│   ├── repositories/    # Data access layer (coming soon)
│   ├── types/           # TypeScript type definitions (coming soon)
│   ├── utils/           # Utility functions
│   └── server.ts        # Main application entry point
├── logs/                # Application logs
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL database
- Redis server

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
   - Database connection string
   - Redis connection string
   - JWT secret (at least 32 characters)
   - Allowed CORS origins

4. Generate Prisma client:
```bash
npm run db:generate
```

5. Run database migrations:
```bash
npm run db:migrate
```

### Development

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## API Endpoints

### System Endpoints

- `GET /health` - Basic health check
- `GET /api/v1/system/health` - Basic health check
- `GET /api/v1/system/health/detailed` - Detailed health check with dependencies
- `GET /api/v1/system/metrics` - Prometheus metrics
- `GET /api/v1/system/version` - API version information

### Coming Soon

- Authentication endpoints (`/api/v1/auth`)
- Dashboard analytics (`/api/v1/dashboard`)
- Case management (`/api/v1/cases`)
- Data import (`/api/v1/import`)

## Environment Variables

See `.env.example` for all available environment variables and their descriptions.

## Security Features

- **Helmet.js** for security headers
- **CORS** with configurable origins
- **Rate limiting** to prevent abuse
- **JWT authentication** with secure token handling
- **Request logging** with correlation IDs
- **Input validation** with Zod schemas

## Monitoring and Logging

- **Winston** for structured logging
- **Prometheus metrics** endpoint
- **Health checks** for dependencies
- **Request/response logging** with correlation IDs
- **Error tracking** with unique error IDs

## Development Guidelines

- Use TypeScript for all code
- Follow the established project structure
- Add proper error handling for all endpoints
- Include comprehensive logging
- Write tests for new functionality
- Use Zod for input validation
- Follow RESTful API conventions

## License

This project is part of the CourtFlow application suite.