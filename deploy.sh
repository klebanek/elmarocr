#!/bin/bash

# ELMAR Warehouse - Deployment Script
# Ten skrypt automatyzuje proces deploymentu na serwerze

set -e  # Zatrzymaj przy błędzie

echo "🚀 ELMAR Warehouse - Deployment"
echo "================================"
echo ""

# Kolory
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Funkcja do wyświetlania kroków
step() {
    echo -e "${GREEN}▶ $1${NC}"
}

error() {
    echo -e "${RED}✗ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Sprawdź czy plik .env istnieje
if [ ! -f .env ]; then
    error "Plik .env nie istnieje!"
    echo ""
    echo "Utwórz plik .env z następującą zawartością:"
    echo "DATABASE_URL=\"libsql://your-database.turso.io\""
    echo "TURSO_AUTH_TOKEN=\"your-token\""
    echo "NODE_ENV=\"production\""
    echo "PORT=3000"
    echo ""
    exit 1
fi

step "1/6 Sprawdzanie środowiska..."
node --version || { error "Node.js nie jest zainstalowany!"; exit 1; }
npm --version || { error "npm nie jest zainstalowany!"; exit 1; }

step "2/6 Instalowanie zależności..."
npm install

step "3/6 Generowanie Prisma Client..."
npx prisma generate

step "4/6 Aplikowanie migracji bazy danych..."
npx prisma db push

# Pytanie czy seedować bazę
echo ""
read -p "Czy chcesz dodać przykładowe dane do bazy? (t/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[TtYy]$ ]]
then
    step "4a/6 Dodawanie przykładowych danych..."
    npm run db:seed
fi

step "5/6 Budowanie aplikacji..."
npm run build

step "6/6 Aplikacja zbudowana!"
echo ""
echo -e "${GREEN}✓ Deployment zakończony pomyślnie!${NC}"
echo ""
echo "Aby uruchomić aplikację:"
echo "  • Testowo:     npm start"
echo "  • Produkcyjnie: pm2 start npm --name elmar-warehouse -- start"
echo ""
echo "Aplikacja będzie dostępna na: http://localhost:3000"
echo ""
