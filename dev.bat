@echo off
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do set IP=%%a
set IP=%IP: =%
echo VITE_API_URL=http://%IP%:8080/api/v1 > .env
echo Configurado para Windows con IP: %IP%
npm run dev -- --host 0.0.0.0