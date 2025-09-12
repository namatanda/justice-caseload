# ==================================
# Multi-stage production Dockerfile
# ==================================

# Stage 1: Base dependencies
FROM node:18-alpine AS base
WORKDIR /app

# Install system dependencies for Alpine
RUN apk add --no-cache libc6-compat openssl

# Copy package files
COPY package*.json ./

# ==================================
# Stage 2: Development dependencies
FROM base AS deps
# Install all dependencies (including devDependencies for build)
RUN npm ci

# ==================================
# Stage 3: Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set build-time environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_DEBUG_ROUTES=true
# Set a dummy DATABASE_URL for build time (Prisma requires this even for build)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Generate Prisma client
RUN npx prisma generate

# Build the application with standalone output for production
RUN npm run build

# ==================================
# Stage 4: Production runtime
FROM node:18-alpine AS runner
WORKDIR /app

# Install runtime system dependencies
RUN apk add --no-cache libc6-compat openssl curl

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy built application from builder stage (standalone mode)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set the correct permissions
RUN chown -R nextjs:nodejs /app

# Copy Prisma schema and generated client
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application (standalone mode)
CMD ["node", "server.js"]