# Technology Stack

## Core Framework
- **Next.js 15** with App Router and TypeScript
- **React 18** for UI components
- **Node.js** runtime environment

## Database & ORM
- **PostgreSQL** as primary database
- **Prisma ORM** for database operations and migrations
- **Redis** for caching and background job queues

## Background Processing
- **BullMQ** for job queue management
- **Redis** as queue backend

## UI & Styling
- **Tailwind CSS** for styling
- **ShadCN UI** component library
- **Radix UI** primitives
- **Lucide React** for icons
- **Recharts** for data visualization

## State Management & Data Fetching
- **TanStack Query** for server state management
- **Zustand** for client state management
- **React Hook Form** with Zod validation

## Testing
- **Vitest** as test runner
- **Testing Library** for component testing
- **jsdom** for DOM simulation

## Development Tools
- **TypeScript** for type safety
- **ESLint** for code linting
- **Turbopack** for fast development builds

## Common Commands

### Development
```bash
npm run dev          # Start development server on port 9002
npm run build        # Build for production
npm run start        # Start production server
npm run typecheck    # Run TypeScript checks
npm run lint         # Run ESLint
```

### Database Operations
```bash
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:deploy    # Deploy migrations to production
npm run db:studio    # Open Prisma Studio on port 5556
npm run db:seed      # Seed database with initial data
npm run db:reset     # Reset database and run migrations
```

### Testing
```bash
npm test             # Run tests with Vitest
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
npm run test:integration # Run integration tests
```

### Docker Operations
```bash
npm run docker:build # Build Docker containers
npm run docker:up    # Start Docker services
npm run docker:down  # Stop Docker services
npm run docker:logs  # View Docker logs
```

### Migration Scripts
```bash
npm run migrate:dev        # Migrate development environment
npm run migrate:staging    # Migrate staging environment
npm run migrate:production # Migrate production environment
```

### Backup Operations
```bash
npm run backup:create   # Create database backup
npm run backup:restore  # Restore from backup
npm run backup:list     # List available backups
npm run backup:cleanup  # Clean up old backups
```