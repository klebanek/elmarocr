# 📦 ELMAR Warehouse - System Magazynowy

Nowoczesna aplikacja webowa do zarządzania dokumentami magazynowymi (WZ - Wydanie Zewnętrzne).

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC)

## ✨ Funkcjonalności

- 📝 **Tworzenie dokumentów WZ** - zarządzanie wydaniami magazynowymi
- 🔍 **Skanowanie kodów kreskowych** - obsługa EAN-13
- 📊 **Baza produktów** - wyszukiwanie i zarządzanie produktami
- 📄 **Generowanie PDF** - profesjonalne dokumenty magazynowe
- 📈 **Eksport Excel** - analiza danych w arkuszach
- 📱 **Responsywny design** - działa na wszystkich urządzeniach
- 🎨 **Nowoczesny UI** - gradient glassmorphic design
- 💾 **Baza danych w chmurze** - Turso (SQLite) lub własna

## 🚀 Szybki start (Lokalne środowisko)

```bash
# 1. Klonuj repozytorium
git clone https://github.com/klebanek/elmarocr.git
cd elmarocr

# 2. Zainstaluj zależności
npm install

# 3. Utwórz plik .env
cp .env.example .env
# Edytuj .env i dodaj DATABASE_URL

# 4. Zastosuj migracje
npx prisma db push

# 5. (Opcjonalnie) Dodaj przykładowe dane
npm run db:seed

# 6. Uruchom development server
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

## 📦 Deployment na własnym serwerze

### Szybki deployment (1 komenda)

```bash
# Na serwerze, po sklonowaniu repozytorium:
./deploy.sh
```

### Lub ręcznie krok po kroku:

**📖 Zobacz kompletną instrukcję:** [DEPLOYMENT.md](./DEPLOYMENT.md)

**Krótko:**

1. **Utwórz bazę danych Turso** (darmowa, w chmurze):
   ```bash
   turso db create elmar-warehouse
   turso db show elmar-warehouse --url
   turso db tokens create elmar-warehouse
   ```

2. **Skonfiguruj `.env`** na serwerze:
   ```bash
   DATABASE_URL="libsql://your-db.turso.io"
   TURSO_AUTH_TOKEN="your-token"
   NODE_ENV="production"
   PORT=3000
   ```

3. **Zbuduj i uruchom**:
   ```bash
   npm install
   npx prisma db push
   npm run build

   # Z PM2 (zalecane):
   pm2 start npm --name elmar-warehouse -- start
   ```

4. **Gotowe!** Aplikacja działa na `http://twoj-serwer:3000`

Pełna dokumentacja z Nginx, SSL, monitoringiem: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

## 🛠️ Technologie

- **[Next.js 16](https://nextjs.org/)** - React framework z App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[Turso](https://turso.tech/)** - SQLite w chmurze (lub lokalna SQLite)
- **[jsPDF](https://github.com/parallax/jsPDF)** - Generowanie PDF
- **[SheetJS](https://sheetjs.com/)** - Eksport do Excel

## 📂 Struktura projektu

```
elmarocr/
├── app/
│   ├── api/              # API endpoints (REST)
│   │   ├── documents/    # CRUD dla dokumentów WZ
│   │   └── products/     # CRUD dla produktów
│   ├── documents/        # Strony dokumentów
│   │   ├── [id]/         # Szczegóły + PDF/Excel export
│   │   ├── new/          # Tworzenie nowego dokumentu
│   │   └── page.tsx      # Lista dokumentów
│   ├── products/         # Zarządzanie bazą produktów
│   └── page.tsx          # Strona główna (dashboard)
├── lib/
│   └── prisma.ts         # Klient Prisma + konfiguracja
├── prisma/
│   ├── schema.prisma     # Schemat bazy danych
│   ├── seed.ts           # Dane testowe (20 produktów)
│   └── migrations/       # Migracje bazy danych
├── public/               # Pliki statyczne
├── DEPLOYMENT.md         # 📖 Pełna instrukcja deploymentu
├── deploy.sh            # 🚀 Automatyczny skrypt deploymentu
└── .env.example          # Przykładowa konfiguracja
```

## 🔧 Dostępne komendy

```bash
npm run dev          # Uruchom development server (localhost:3000)
npm run build        # Zbuduj aplikację produkcyjną
npm run start        # Uruchom production server
npm run lint         # Sprawdź kod (ESLint)
npm run db:push      # Aplikuj zmiany w schemacie bazy
npm run db:seed      # Dodaj przykładowe dane testowe
./deploy.sh          # Automatyczny deployment (na serwerze)
```

## 📸 Screenshot

> *Wkrótce - screenshoty aplikacji*

## 🐛 Rozwiązywanie problemów

### Błąd połączenia z bazą danych

```bash
# Sprawdź DATABASE_URL
echo $DATABASE_URL

# Zregeneruj Prisma Client
npx prisma generate
npx prisma db push
```

### Aplikacja nie buduje się

```bash
# Wyczyść cache i przebuduj
rm -rf .next node_modules
npm install
npm run build
```

### Problemy z PM2

```bash
# Zobacz logi
pm2 logs elmar-warehouse

# Restart
pm2 restart elmar-warehouse

# Status
pm2 status
```

**Więcej:** [DEPLOYMENT.md - Troubleshooting](./DEPLOYMENT.md#-rozwiązywanie-problemów)

## 📄 Licencja

Projekt stworzony dla ELMAR.

## 🤝 Wsparcie

Jeśli napotkasz problemy:
1. Sprawdź [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Zobacz [Issues](https://github.com/klebanek/elmarocr/issues)
3. Utwórz nowy Issue z opisem problemu

---

**Stworzone z ❤️ przy użyciu Next.js 16 i Claude**
