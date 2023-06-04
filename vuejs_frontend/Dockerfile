# Base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy the source code to the working directory
COPY . .

# Build the Vue.js application
RUN npm run build

# Expose the application port (optional)
EXPOSE 8080

# Start the application
CMD ["npm", "run", "serve"]
