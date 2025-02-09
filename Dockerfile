# Construcción de React
FROM node:18-alpine AS build
WORKDIR /app

# Copiar archivos y construir la aplicación
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Fase final con Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build .

# Agregar el archivo env.js para que React lo lea en tiempo de ejecución
COPY env.js ./env.js

# Exponer el puerto 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
