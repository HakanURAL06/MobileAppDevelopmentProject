FROM node:20-alpine

WORKDIR /app

# Paket bağımlılıklarını kopyala ve kur
COPY package.json ./

RUN npm install

# Kaynak kodları kopyala
COPY . .

# Metro Bundler ve Web portları
EXPOSE 8081 19000 19001 19002

# Varsayılan başlangıç komutu
CMD ["npx", "expo", "start", "--web", "--host", "lan"]
