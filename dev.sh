#!/bin/bash
# Script para configurar y arrancar el servidor de desarrollo de PhotoBogota 
# y poder acceder desde otras máquinas en la misma red local. (Celular por ejemplo)

# PARA LINUX
# EJECUTAR ESTE SCRIPT DESDE LA RAIZ DEL PROYECTO CON:
# chmod +x dev.sh
# ./dev.sh

# En caso de que el firewall bloquee el puerto, asegúrate de permitir el tráfico en el puerto 8080.
# Permitir el tráfico de Vite
# sudo ufw allow 5173/tcp

# Permitir el tráfico de Spring Boot
# sudo ufw allow 8080/tcp


# 1. Obtener la IP privada (la primera que aparezca)
IP_LOCAL=$(hostname -I | awk '{print $1}')

echo "Configurando PhotoBogota para la IP: $IP_LOCAL"

# 2. Crear o sobrescribir el archivo .env con la IP detectada
cat <<EOF > .env
VITE_API_URL=http://$IP_LOCAL:8080/api/v1
EOF

echo "Archivo .env actualizado."

# 3. Arrancar el servidor de Vite con host 0.0.0.0
echo "Iniciando servidor de desarrollo..."
npm run dev -- --host 0.0.0.0