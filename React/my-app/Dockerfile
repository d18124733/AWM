# frontend/Dockerfile
# Use Node.js to build the React app
FROM node:16 as build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json /app/
COPY package-lock.json /app/
RUN npm install

# Copy app source code and build
COPY . /app
RUN npm run build

# Output built files to a shared volume or mount point
CMD ["npm", "run", "build"]
