# Project Structure

## Root Directory Organization

```
├── src/                    # Source code
├── prisma/                 # Database schema and migrations
├── tests/                  # Test files organized by type
├── docs/                   # Documentation
├── scripts/                # Utility scripts
├── monitoring/             # Monitoring configurations
├── uploads/                # File upload storage
├── public/                 # Static assets
└── .kiro/                  # Kiro AI assistant configuration
```

## Source Code Structure (`src/`)

### Application Layer (`src/app/`)
- **Next.js App Router** structure
- `layout.tsx` - Root layout with providers
- `page.tsx` - Main dashboard page
- `providers.tsx` - React Query and other providers
- `api/` - API route handlers
- `admin/` - Admin interface pages
- `import/` - Data import interface

### Components (`src/components/`)
- `ui/` - Reusable UI components (ShadCN)
- `dashboard/` - Dashboard-specific components
- `features/` - Feature-specific components
- `layouts/` - Layout components

### Business Logic (`src/lib/`)
- `api/` - API client functions
- `auth/` - Authentication logic
- `data/` - Data access layer
- `db/` - Database utilities
- `repositories/` - Data repository pattern
- `services/` - Business service layer
- `operations/` - Complex business operations
- `validation/` - Zod schemas and validation
- `hooks/` - Custom React hooks
- `stores/` - Zustand state stores
- `utils.ts` - Utility functions

### Types (`src/types/`)
- TypeScript type definitions
- Global type declarations

## Database (`prisma/`)
- `schema.prisma` - Main database schema
- `schema.test.prisma` - Test database schema
- `migrations/` - Database migration files
- `seed.ts` - Database seeding script

## Testing (`tests/`)
- `unit/` - Unit tests
- `integration/` - Integration tests
- `components/` - Component tests
- `database/` - Database tests
- `operations/` - Business logic tests
- `performance/` - Performance tests
- `validation/` - Validation tests
- `setup.ts` - Test configuration

## Key Conventions

### File Naming
- Use kebab-case for files and folders
- Components use PascalCase
- API routes follow Next.js conventions

### Import Aliases
- `@/*` maps to `src/*`
- Use absolute imports for cleaner code

### Component Organization
- One component per file
- Co-locate related components
- Separate UI components from business logic

### Database Patterns
- Repository pattern for data access
- Service layer for business logic
- Prisma models follow snake_case in database
- TypeScript interfaces use camelCase

### API Structure
- RESTful API routes in `src/app/api/`
- Consistent error handling
- Input validation with Zod schemas

### State Management
- Server state with TanStack Query
- Client state with Zustand
- Form state with React Hook Form