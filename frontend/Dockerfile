# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /frontend

# Copia los archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el código fuente
COPY . .

# Construye la aplicación
RUN npm run build

# Sirve la aplicación en producción
EXPOSE 4173
CMD ["npx", "vite", "preview", "--host", "0.0.0.0"]
