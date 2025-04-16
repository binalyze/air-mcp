FROM node:lts-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies without triggering any unwanted scripts
RUN npm install --ignore-scripts


COPY . .

# Build the application
RUN npm run build

# Command to run the server
CMD [ "node", "build/index.js" ]