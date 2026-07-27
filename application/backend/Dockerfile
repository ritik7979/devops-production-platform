# Use official Node.js image
FROM node:22-alpine

# Create working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Expose backend port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
