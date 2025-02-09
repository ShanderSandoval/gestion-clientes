# Etapa 1: Construcción de la aplicación React
FROM node:18-alpine AS build
WORKDIR /app

# Copiar archivos de dependencias e instalar
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copiar los archivos estáticos generados por React
COPY --from=build /app/build .

# Exponer el puerto 80 para servir la aplicación
EXPOSE 80

# Comando de inicio para Nginx
CMD ["nginx", "-g", "daemon off;"]
