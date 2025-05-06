# Use the official Node.js image
FROM node:16

# Set working directory inside the container
WORKDIR /app

# Copy dependency declarations first for better layer caching
COPY package*.json ./

# Install ALL dependencies (including nodemon)
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Expose backend port
EXPOSE 5001

# Use nodemon for development
CMD ["npm", "run", "dev"]
