# Use official Node.js image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only package files first for caching
COPY Clothing-Backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your backend source code
COPY Clothing-Backend/ .

# Set environment variable (optional)
ENV NODE_ENV=production

# Expose the backend port
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]
