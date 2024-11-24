# Gebruik Node.js voor de server
FROM node:18

# Stel werkmap in
WORKDIR /usr/src/app

# Kopieer package.json en installeer afhankelijkheden
COPY package*.json ./
RUN npm install

# Kopieer de rest van de code
COPY . .

# Exposeer poort 5001
EXPOSE 5001

# Start de applicatie
CMD ["npm", "start"]