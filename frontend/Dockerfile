# Use Node.js LTS Alpine image
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Expose React dev server port
EXPOSE 3000

# Start the React dev server
CMD ["npm", "start"]