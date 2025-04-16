FROM node:lts-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the project
RUN npm run build

# Set production environment
ENV NODE_ENV=production

# Clean up dev dependencies
RUN npm ci --ignore-scripts --omit=dev

# Expose port if needed by Smithery
EXPOSE 3000

# Run the server
ENTRYPOINT ["node", "build/index.js"]