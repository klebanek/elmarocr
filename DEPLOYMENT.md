# 🚀 Instrukcja Deploymentu - ELMAR Warehouse

Kompletny przewodnik jak uruchomić aplikację na własnym serwerze.

---

## 📋 Wymagania

- **Node.js** 18.17 lub nowszy
- **npm** lub **yarn**
- **Serwer** z dostępem SSH (np. VPS, dedykowany serwer)
- **Domena** (opcjonalnie, ale zalecane)
- **Port** 3000 lub inny dostępny

---

## 🗄️ Opcja 1: Baza danych Turso (Zalecane - DARMOWE)

### Krok 1: Utwórz bazę danych Turso

```bash
# Zainstaluj Turso CLI (jednorazowo)
curl -sSfL https://get.tur.so/install.sh | bash

# Zaloguj się (otworzy przeglądarkę)
turso auth login

# Utwórz bazę danych
turso db create elmar-warehouse

# Pobierz URL bazy (ZAPISZ!)
turso db show elmar-warehouse --url
# Przykład: libsql://elmar-warehouse-twojlogin.turso.io

# Utwórz token autoryzacji (ZAPISZ!)
turso db tokens create elmar-warehouse
# Przykład: eyJhbGc...
```

### Krok 2: Skonfiguruj zmienne środowiskowe

Na serwerze, w katalogu aplikacji utwórz plik `.env`:

```bash
DATABASE_URL="libsql://elmar-warehouse-twojlogin.turso.io"
TURSO_AUTH_TOKEN="eyJhbGc..."
NODE_ENV="production"
PORT=3000
```

---

## 🗄️ Opcja 2: Własna baza SQLite (Lokalnie na serwerze)

Jeśli chcesz trzymać bazę lokalnie na serwerze:

```bash
# Plik .env
DATABASE_URL="file:./prisma/production.db"
NODE_ENV="production"
PORT=3000
```

**Uwaga:** Upewnij się że folder `prisma/` ma prawa do zapisu!

---

## 📦 Deployment Krok po Kroku

### 1. Przygotuj kod na serwerze

```bash
# Zaloguj się na serwer przez SSH
ssh uzytkownik@twoj-serwer.pl

# Przejdź do katalogu aplikacji (lub utwórz nowy)
mkdir -p /var/www/elmar-warehouse
cd /var/www/elmar-warehouse

# Sklonuj repozytorium
git clone https://github.com/klebanek/elmarocr.git .

# LUB przenieś pliki przez SCP/SFTP z lokalnego komputera
```

### 2. Zainstaluj zależności

```bash
npm install
```

### 3. Skonfiguruj zmienne środowiskowe

```bash
# Utwórz plik .env (użyj wartości z Kroku 1 lub 2)
nano .env
```

Wklej:
```
DATABASE_URL="libsql://..."
TURSO_AUTH_TOKEN="..."
NODE_ENV="production"
PORT=3000
```

Zapisz: `CTRL+O`, `ENTER`, `CTRL+X`

### 4. Zastosuj migracje bazy danych

```bash
npx prisma db push
```

### 5. (Opcjonalnie) Dodaj przykładowe dane

```bash
npm run db:seed
```

### 6. Zbuduj aplikację

```bash
npm run build
```

Po buildzie aplikacja będzie w folderze `.next/standalone/`

### 7. Uruchom aplikację

#### Opcja A: Bezpośrednio (testowo)

```bash
npm start
```

Aplikacja będzie dostępna na `http://twoj-serwer:3000`

#### Opcja B: PM2 (zalecane do produkcji)

```bash
# Zainstaluj PM2 globalnie
npm install -g pm2

# Uruchom aplikację
pm2 start npm --name "elmar-warehouse" -- start

# Ustaw autostart po restarcie serwera
pm2 startup
pm2 save

# Sprawdź status
pm2 status

# Logi
pm2 logs elmar-warehouse

# Restart
pm2 restart elmar-warehouse
```

---

## 🌐 Konfiguracja Nginx (Reverse Proxy)

Jeśli chcesz aby aplikacja była dostępna pod domeną (np. `warehouse.twojafirma.pl`):

### 1. Zainstaluj Nginx

```bash
sudo apt update
sudo apt install nginx
```

### 2. Utwórz konfigurację

```bash
sudo nano /etc/nginx/sites-available/elmar-warehouse
```

Wklej:

```nginx
server {
    listen 80;
    server_name warehouse.twojafirma.pl;  # ZMIEŃ NA SWOJĄ DOMENĘ

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Włącz konfigurację

```bash
sudo ln -s /etc/nginx/sites-available/elmar-warehouse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. (Opcjonalnie) SSL z Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d warehouse.twojafirma.pl
```

---

## 🔄 Aktualizacja Aplikacji

Gdy wprowadzisz zmiany w kodzie:

```bash
# 1. Pobierz nowe zmiany
git pull origin main

# 2. Zainstaluj nowe zależności (jeśli były)
npm install

# 3. Zastosuj migracje (jeśli były)
npx prisma db push

# 4. Przebuduj aplikację
npm run build

# 5. Restartuj PM2
pm2 restart elmar-warehouse
```

---

## 🐛 Rozwiązywanie problemów

### Aplikacja nie startuje

```bash
# Sprawdź logi
pm2 logs elmar-warehouse

# Sprawdź czy port 3000 jest zajęty
sudo lsof -i :3000

# Sprawdź zmienne środowiskowe
cat .env
```

### Błąd połączenia z bazą danych

```bash
# Sprawdź czy DATABASE_URL jest poprawny
echo $DATABASE_URL

# Sprawdź połączenie z Turso
turso db show elmar-warehouse

# Zregeneruj Prisma Client
npx prisma generate
```

### Brak uprawnień do plików

```bash
# Nadaj odpowiednie uprawnienia
sudo chown -R $USER:$USER /var/www/elmar-warehouse
chmod -R 755 /var/www/elmar-warehouse
```

---

## 📊 Monitorowanie

### Logi aplikacji (PM2)

```bash
pm2 logs elmar-warehouse          # Wszystkie logi
pm2 logs elmar-warehouse --lines 100  # Ostatnie 100 linii
pm2 logs elmar-warehouse --err    # Tylko błędy
```

### Status aplikacji

```bash
pm2 status
pm2 monit  # Interaktywny monitoring
```

### Baza danych

```bash
# Turso - sprawdź rozmiar i statystyki
turso db show elmar-warehouse

# Backup bazy Turso
turso db shell elmar-warehouse .dump > backup.sql

# Lokalna SQLite - backup
cp prisma/production.db prisma/backup-$(date +%Y%m%d).db
```

---

## 🔒 Bezpieczeństwo

### 1. Firewall

```bash
# Zezwól tylko na porty 80, 443, 22
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Zmienne środowiskowe

- **NIGDY** nie commituj pliku `.env` do git
- Trzymaj `.env` tylko na serwerze
- Regularnie zmieniaj tokeny dostępowe

### 3. Aktualizacje

```bash
# Regularnie aktualizuj system
sudo apt update && sudo apt upgrade

# Aktualizuj Node.js
sudo npm install -g n
sudo n lts
```

---

## 📞 Wsparcie

W razie problemów:
1. Sprawdź logi: `pm2 logs`
2. Sprawdź status: `pm2 status`
3. Zobacz [Issues](https://github.com/klebanek/elmarocr/issues)

---

## ✅ Checklist Deploymentu

- [ ] Node.js 18+ zainstalowany
- [ ] Repozytorium sklonowane na serwer
- [ ] Plik `.env` utworzony z poprawnymi wartościami
- [ ] `npm install` wykonany
- [ ] Baza danych utworzona (Turso lub lokalna)
- [ ] `npx prisma db push` wykonany
- [ ] (Opcjonalnie) `npm run db:seed` wykonany
- [ ] `npm run build` wykonany
- [ ] PM2 zainstalowany i skonfigurowany
- [ ] Aplikacja uruchomiona przez PM2
- [ ] Nginx skonfigurowany (opcjonalnie)
- [ ] SSL skonfigurowany (opcjonalnie)
- [ ] Firewall skonfigurowany
- [ ] Backup bazy danych ustawiony

---

**Gotowe! Twoja aplikacja działa na: `http://twoj-serwer:3000` lub `https://warehouse.twojafirma.pl`** 🎉
