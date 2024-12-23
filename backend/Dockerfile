# Use the Node.js 18 official image as the base
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the application's port (e.g., 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
