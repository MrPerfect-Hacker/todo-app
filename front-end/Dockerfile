# Gebruik een Nginx image om de bestanden te serveren
FROM nginx:alpine

# Kopieer de HTML, CSS en JS bestanden naar de Nginx container
COPY ./index.html /usr/share/nginx/html
COPY ./css /usr/share/nginx/html/css
COPY ./js /usr/share/nginx/html/js

# Exposeer poort 80
EXPOSE 80
