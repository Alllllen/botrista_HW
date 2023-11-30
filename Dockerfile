# Use the official Node.js image as the base image
FROM node:alpine

COPY . /workspace

WORKDIR /workspace

RUN npm install

# Expose the port that your app will run on
EXPOSE 8080

# Command to run the application
CMD ["node", "server.js"]
