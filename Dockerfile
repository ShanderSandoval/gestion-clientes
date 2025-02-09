# Construir la app de React
FROM node:18-alpine AS build

WORKDIR /app

# Copia archivos necesarios
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Inyectar la variable de entorno al build
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Construir la aplicación
RUN npm run build

# Usar Nginx para servir la app
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
