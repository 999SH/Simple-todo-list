# Use an official Node.js runtime as the base image
FROM node:16-alpine

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the server listens on
EXPOSE 3001

# Start the server
CMD ["npm", "run", "start"]

