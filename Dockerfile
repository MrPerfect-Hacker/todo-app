# Base image
FROM node:18

# Werkmap instellen
WORKDIR /app

# package.json en package-lock.json kopiëren
COPY package*.json ./

# Installeren van dependencies
RUN npm install

# Code kopiëren
COPY . .

# Expose port
EXPOSE 3000

# Start applicatie
CMD ["npm", "start"]