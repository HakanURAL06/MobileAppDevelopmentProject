#!/bin/bash

# Mac'in aktif yerel IP adresini en0 veya en1 arayüzünden otomatik tespit et
export HOST_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)

if [ -z "$HOST_IP" ]; then
  echo "Hata: Aktif yerel IP adresi bulunamadi! Wi-Fi baglantinizi kontrol edin."
  exit 1
fi

echo "Algılanan Aktif IP: $HOST_IP"




# Dinamik IP ile projeyi yeniden baslat
docker compose up
