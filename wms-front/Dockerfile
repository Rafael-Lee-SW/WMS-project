# Step 1: Use the official Node.js 16 image as the base image
FROM node:16-alpine

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code into the container
COPY . .

# Step 6: Build the application
RUN npm run build

# Step 7: Expose the port the app runs on
EXPOSE 3000

# Step 8: Define the command to run the application
CMD ["npm", "start"]
