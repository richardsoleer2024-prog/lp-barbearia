#!/bin/bash
# LP Barbearia - Iniciar projeto

echo "🚀 Iniciando LP Barbearia..."
echo ""

# Verificar se as dependências estão instaladas
if [ ! -d "backend/node_modules" ]; then
  echo "📦 Instalando dependências do backend..."
  cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "📦 Instalando dependências do frontend..."
  cd frontend && npm install && cd ..
fi

echo ""
echo "✅ Dependências OK!"
echo ""
echo "▶  Backend:  http://localhost:3001"
echo "▶  Frontend: http://localhost:5173"
echo ""

# Iniciar os dois em paralelo
cd backend && npm run start:dev &
BACKEND_PID=$!

cd frontend && npm run dev &
FRONTEND_PID=$!

# Aguardar Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; echo 'Servidores encerrados.'" SIGINT
wait
