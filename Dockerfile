# Usa una imagen base de Node.js
FROM node:20

# Establece el directorio de trabajo
WORKDIR /

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install 

# Copia el resto del código
COPY . .

# Expone el puerto del backend
EXPOSE 3000

# Comando para iniciar el backend
CMD ["npm", "run","dev"]
