FROM node:20-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY src/ ./src

# Expose port
EXPOSE 8082

# Start the service
CMD ["node", "src/index.js"]