FROM node:20-alpine

WORKDIR /app

# Gerekli bağımlılıkları yükle
COPY package.json ./

RUN npm install

# Kaynak kodları kopyala
COPY . .

# Metro bundler / Web portu
EXPOSE 8081 19000 19001 19002

# Expo sunucusunu web desteği ile başlat
CMD ["npx", "expo", "start", "--web", "--host", "lan"]
