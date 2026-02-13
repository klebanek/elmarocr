# ELMAR PWA - System Śledzenia Produktów

Progressive Web App do zarządzania dokumentami magazynowymi (WZ) dla Zakładu Przetwórstwa Ryb "ELMAR" w Białej Podlaskiej.

## ✨ Funkcjonalności

- 📝 **Tworzenie dokumentów WZ** - zarządzanie wydaniami magazynowymi
- 🔍 **Skanowanie kodów kreskowych** - obsługa EAN-13 z kamerą urządzenia
- 📦 **Baza produktów** - ~400 produktów rybnych
- 📄 **Generowanie PDF** - profesjonalne dokumenty z kodami kreskowymi
- 📊 **Eksport/Import Excel** - zarządzanie bazą produktów
- 💾 **Działanie offline** - localStorage, service worker
- 📱 **Responsywny design** - mobile-first

## 🚀 Live Demo

Aplikacja dostępna pod adresem: **https://klebanek.github.io/elmarocr/**

## 🛠️ Technologie

- **HTML5/CSS3/JavaScript** - vanilla JS (bez frameworków)
- **Quagga.js** - skanowanie kodów kreskowych
- **jsPDF** - generowanie dokumentów PDF
- **SheetJS (XLSX)** - import/export Excel
- **JsBarcode** - generowanie graficznych kodów EAN-13
- **Service Worker** - cache i praca offline

## 📦 Deployment

Aplikacja jest automatycznie deployowana na GitHub Pages przy każdym pushu do brancha.

### Struktura

```
elmarocr/
├── index.html          # Główny plik aplikacji (all-in-one)
├── logo.png            # Logo ELMAR
├── .nojekyll          # Wyłączenie Jekyll processing
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions deployment
```

## 💾 Przechowywanie danych

Aplikacja używa `localStorage` do przechowywania:

- `elmarDocuments` - wszystkie dokumenty WZ
- `elmarCurrentDocument` - dokument w edycji
- `elmarCustomProducts` - produkty dodane ręcznie

## 🔧 Rozwój

Aplikacja jest standalone - cały kod w jednym pliku `index.html`:

- Inline CSS (zmienne CSS, glass morphism design)
- Inline JavaScript (klasa `ElmarApp`)
- Zewnętrzne biblioteki z CDN

### Edycja lokalna

```bash
# Sklonuj repozytorium
git clone https://github.com/klebanek/elmarocr.git
cd elmarocr

# Otwórz w przeglądarce
open index.html
# lub uruchom lokalny serwer:
python3 -m http.server 8000
```

## 📱 Instalacja jako PWA

Aplikację można zainstalować na urządzeniu mobilnym:

1. Otwórz w przeglądarce mobilnej
2. Kliknij "Dodaj do ekranu głównego"
3. Gotowe! Działa offline

## 📄 Licencja

Projekt stworzony dla ELMAR - Zakład Przetwórstwa Ryb, Biała Podlaska.

---

**Stworzone przez INOVIT.com.pl**
