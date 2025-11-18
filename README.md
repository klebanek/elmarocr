# 📦 ELMAR Warehouse - System Magazynowy

Nowoczesna aplikacja webowa do zarządzania dokumentami magazynowymi (WZ - Wydanie Zewnętrzne).

## ✨ Funkcjonalności

- 📝 **Tworzenie dokumentów WZ** - zarządzanie wydaniami magazynowymi
- 🔍 **Skanowanie kodów kreskowych** - EAN-13
- 📊 **Baza produktów** - wyszukiwanie i zarządzanie
- 📄 **Generowanie PDF** - profesjonalne dokumenty
- 📈 **Eksport Excel** - analiza danych
- 📱 **Responsywny design** - działa na wszystkich urządzeniach
- 🎨 **Nowoczesny UI** - gradient glassmorphic design

## 🚀 Szybki start (Development)

### 1. Instalacja

```bash
# Klonuj repozytorium
git clone https://github.com/klebanek/elmarocr.git
cd elmarocr

# Zainstaluj zależności
npm install
```

### 2. Konfiguracja bazy danych

```bash
# Utwórz plik .env
cp .env.example .env

# Zastosuj migracje
npx prisma db push

# (Opcjonalnie) Dodaj przykładowe dane
npm run db:seed
```

### 3. Uruchom aplikację

```bash
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

## 🌐 Deploy na Vercel (Wersja testowa)

### Krok 1: Utwórz bazę danych Turso (darmowa)

```bash
# Zainstaluj Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Zaloguj się
turso auth login

# Utwórz bazę danych
turso db create elmar-warehouse

# Pobierz URL bazy danych
turso db show elmar-warehouse --url

# Utwórz token autoryzacji
turso db tokens create elmar-warehouse
```

Zapisz **URL** i **TOKEN** - będą potrzebne w następnym kroku.

### Krok 2: Deploy na Vercel

#### Opcja A: Deploy przez przeglądarkę (Łatwiejsze)

1. **Otwórz [Vercel](https://vercel.com)**
2. **Kliknij "Add New" → "Project"**
3. **Importuj repozytorium GitHub:**
   - Wybierz `klebanek/elmarocr`
   - Kliknij "Import"

4. **Skonfiguruj zmienne środowiskowe:**
   - Kliknij "Environment Variables"
   - Dodaj:
     ```
     DATABASE_URL = libsql://[your-database-url]
     TURSO_AUTH_TOKEN = [your-auth-token]
     ```
   - Zastąp `[your-database-url]` i `[your-auth-token]` wartościami z Kroku 1

5. **Kliknij "Deploy"**

6. **Po deploymencie, zastosuj migracje:**
   ```bash
   # Użyj DATABASE_URL z Turso
   DATABASE_URL="libsql://[your-url]" TURSO_AUTH_TOKEN="[your-token]" npx prisma db push

   # Dodaj przykładowe dane
   DATABASE_URL="libsql://[your-url]" TURSO_AUTH_TOKEN="[your-token]" npm run db:seed
   ```

#### Opcja B: Deploy przez CLI

```bash
# Zainstaluj Vercel CLI
npm install -g vercel

# Zaloguj się
vercel login

# Deploy
vercel

# Dodaj zmienne środowiskowe
vercel env add DATABASE_URL
# Wklej: libsql://[your-database-url]

vercel env add TURSO_AUTH_TOKEN
# Wklej: [your-auth-token]

# Zrób production deployment
vercel --prod
```

### Krok 3: Zastosuj migracje bazy danych

Po deployment:

```bash
# Połącz się z bazą Turso
turso db shell elmar-warehouse

# Aplikuj migracje ręcznie lub:
# Użyj prisma db push z production DATABASE_URL
```

**Lub** użyj **Vercel CLI**:

```bash
# Uruchom seed script w produkcji
vercel env pull .env.production
npm run db:push
npm run db:seed
```

## 📂 Struktura projektu

```
elmarocr/
├── app/
│   ├── api/              # API endpoints
│   │   ├── documents/    # Dokumenty WZ
│   │   └── products/     # Produkty
│   ├── documents/        # Strony dokumentów
│   ├── products/         # Strona produktów
│   └── page.tsx          # Strona główna
├── lib/
│   └── prisma.ts         # Klient Prisma
├── prisma/
│   ├── schema.prisma     # Schemat bazy
│   ├── seed.ts           # Dane testowe
│   └── migrations/       # Migracje
└── public/               # Pliki statyczne
```

## 🛠️ Technologie

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Prisma** - ORM
- **SQLite/Turso** - Baza danych
- **jsPDF** - Generowanie PDF
- **XLSX** - Eksport Excel

## 📱 PWA (Progressive Web App)

Aplikacja może działać offline po zainstalowaniu:

1. Otwórz aplikację w przeglądarce mobilnej
2. Kliknij "Dodaj do ekranu głównego"
3. Aplikacja zainstaluje się jak natywna

*Uwaga: PWA jest obecnie wyłączone w konfiguracji. Aby włączyć, odkomentuj kod w `next.config.ts`*

## 🔧 Dostępne komendy

```bash
npm run dev          # Uruchom development server
npm run build        # Zbuduj aplikację
npm run start        # Uruchom production server
npm run lint         # Sprawdź kod
npm run db:push      # Aplikuj zmiany w bazie
npm run db:seed      # Dodaj przykładowe dane
```

## 🐛 Rozwiązywanie problemów

### Problem: Błąd połączenia z bazą danych

**Rozwiązanie:**
```bash
# Sprawdź czy DATABASE_URL jest poprawny
echo $DATABASE_URL

# Zregeneruj Prisma Client
npx prisma generate
```

### Problem: Build error na Vercel

**Rozwiązanie:**
- Upewnij się że zmienne środowiskowe są ustawione
- Sprawdź logi: `vercel logs`
- Zweryfikuj czy Turso database działa: `turso db show elmar-warehouse`

### Problem: Seed script nie działa

**Rozwiązanie:**
```bash
# Upewnij się że baza jest pusta lub
# Usuń istniejące dane przed seedowaniem
npx prisma db push --force-reset
npm run db:seed
```

## 📄 Licencja

Projekt stworzony dla ELMAR.

## 🤝 Wsparcie

Jeśli napotkasz problemy:
1. Sprawdź [Issues](https://github.com/klebanek/elmarocr/issues)
2. Utwórz nowy Issue z opisem problemu
3. Dołącz logi błędów i kroki do reprodukcji

---

**Stworzone z ❤️ przy użyciu Next.js i Claude**
