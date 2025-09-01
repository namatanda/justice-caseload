# Use Node.js 18 as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Set environment variables for build
ENV DATABASE_URL="postgresql://fiend:1a6n4g3e5l1a@database:5432/caseload?sslmode=disable"
ENV REDIS_URL="redis://redis:6379"
ENV NODE_ENV="production"

# Generate Prisma client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 3000

# Build and start the application
CMD ["sh", "-c", "npm run build && npm start"]