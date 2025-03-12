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
COPY package.json ./
COPY next.config.js ./next.config.js

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD2ZeFKBfqqZ0Qxvz_6wMWXlpf0LRiFLzQ
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=webdesigntest-12d11.firebaseapp.com
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=webdesigntest-12d11
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=webdesigntest-12d11.firebasestorage.app
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=504944796544
ENV NEXT_PUBLIC_FIREBASE_APP_ID=1:504944796544:web:b14fcaa569d03ce2499765

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 