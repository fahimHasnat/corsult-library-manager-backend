# Dockerfile for Next.js
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the default Next.js port
EXPOSE 8001

# Command to run the application
CMD ["npm", "run", "start"]
