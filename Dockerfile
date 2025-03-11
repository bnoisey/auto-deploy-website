# Use Node.js 18 as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy the pre-built application
COPY .next ./.next
COPY public ./public
COPY next.config.js ./next.config.js
COPY .env ./.env

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 