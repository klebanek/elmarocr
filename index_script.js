        // ELMAR PWA Application - Complete Version
        class ElmarApp {
            constructor() {
                this.currentDocument = null;
                this.documents = [];
                this.productDatabase = {};
                this.currentScreen = 'startScreen';
                this.scannerActive = false;
                this.currentBarcode = null;
                this.showAllDocuments = false; // Domyślnie pokazuj tylko dzisiejsze
                this.cameraPermissionGranted = false; // Status uprawnień do kamery

                this.init();
            }

            async init() {
                // Show splash screen
                const splashScreen = document.getElementById('splashScreen');

                await this.loadProductDatabase();
                this.setupEventListeners();
                this.loadStoredData();
                this.showScreen('startScreen');
                this.registerServiceWorker();

                const today = new Date().toISOString().split('T')[0];
                document.getElementById('documentDate').value = today;

                this.initializeResponsiveFeatures();

                // Hide splash screen after minimum display time
                setTimeout(() => {
                    this.hideSplashScreen();
                }, 2500); // 2.5s - elegant splash screen display
            }

            hideSplashScreen() {
                const splashScreen = document.getElementById('splashScreen');
                if (splashScreen) {
                    splashScreen.classList.add('fade-out');
                    setTimeout(() => {
                        splashScreen.style.display = 'none';
                        splashScreen.remove();
                    }, 600); // Match fade-out animation duration
                }
            }

            async loadProductDatabase() {
                this.productDatabase = {
                    "5903240542246": "Brzuszki z łososia wędzone 3-5 3kg",
                    "5903240542284": "Brzuszki z łososia wędzone 3kg",
                    "5907632658096": "Dorada wędzona 2kg",
                    "5907632658218": "Dorsz atlantycki smażony w panierce 2kg",
                    "5903240542000": "Dorsz czarny filet mrożony 1kg",
                    "5903240542734": "Dorsz czarny filet mrożony 2kg",
                    "5903240542765": "Dorsz czarny filet mrożony 3kg",
                    "5903240542673": "Dorsz plamiak tusza 3kg",
                    "5903240542147": "Dorsz wędzony 3kg",
                    "5903240542307": "Faworki wędzone 2kg",
                    "5903240542833": "Filet śledziowy opiekany w cieście 2kg",
                    "5903240542192": "Filet z łososia wędzony 2kg",
                    "5903240542994": "FILET Z MIRUNY NOWOZELANDZKIEJ ZE SKÓRĄ 1kg",
                    "5903240542239": "FILET Z MIRUNY NOWOZELANDZKIEJ ZE SKÓRĄ 2kg",
                    "5903240542642": "FILET Z MIRUNY NOWOZELANDZKIEJ ZE SKÓRĄ 3kg",
                    "5903240542871": "Filet z miruny z/s w cieście 2kg",
                    "5903240542406": "Filety rybne zapiekane z serem 2kg",
                    "5907632658683": "Filety śledziowe \"A'la łosoś\" 3.3kg",
                    "5907632658713": "Filety śledziowe \"Domowe\" 3,3kg",
                    "5903240542550": "Filety śledziowe \"Domowe\" 450g",
                    "5907632658614": "Filety śledziowe \"Pieguski\" 3kg",
                    "5903240542543": "Filety śledziowe \"Pieguski\" 450g",
                    "5907632658867": "FILETY ŚLEDZIOWE \"PODLASKIE\" ze skórą 1kg",
                    "5907632658539": "Filety śledziowe \"Salsa\" 3kg",
                    "5903240542093": "Filety śledziowe \"Salsa\" 500g",
                    "5907632658508": "Filety śledziowe \"Sułtańskie\" 3kg",
                    "5907632658515": "Filety śledziowe \"Sułtańskie\" 450g",
                    "5907632658171": "Filety śledziowe \"Wiejskie\" 1kg",
                    "5907632658195": "Filety śledziowe \"Wiejskie\" 3,5kg",
                    "5907632658188": "Filety śledziowe \"Wiejskie\" 3.3kg",
                    "5903240542031": "Filety śledziowe \"Wiejskie\" 450g",
                    "5907632658782": "Filety śledziowe \"Wiejskie\" 5.5kg",
                    "5907632658164": "Filety śledziowe \"Wiejskie\" 800g",
                    "5907632658324": "Filety śledziowe BRYZA 3.3kg",
                    "5903240542505": "Filety śledziowe marynowane \"Tomatillo\" 1kg",
                    "5903240542437": "Filety śledziowe marynowane \"Tomatillo\" 2kg",
                    "5907632658485": "Filety śledziowe marynowane \"Tomatillo\" 3,3kg",
                    "5903240542055": "Filety śledziowe marynowane \"Tomatillo\" 450g",
                    "5903240542741": "Filety śledziowe solone KORZENNE 2kg",
                    "5903240542772": "Filety śledziowe solone KORZENNE 450g",
                    "5907632658881": "Filety śledziowe w sosie śmietanowym 1kg",
                    "5903240542987": "Filety śledziowe w sosie śmietanowym 2kg",
                    "5903240542789": "Filety śledziowe w sosie śmietanowym 300g",
                    "5903240542475": "Filety śledziowe z żurawiną 1kg",
                    "5903240542451": "Filety śledziowe z żurawiną 2kg",
                    "5903240542567": "Filety śledziowe z żurawiną 450g",
                    "5907632658850": "Halibut ogonki wędzone 2kg",
                    "5903240542215": "Halibut wędzony 2kg",
                    "5903240542703": "Karmazyn wędzony 2kg",
                    "5903240542413": "Karp wędzony 2kg",
                    "5903240542277": "Kiełbaski z łososia 2kg",
                    "5907632658447": "Koreczki śledziowe \"Po szlachecku\" 1kg",
                    "5907632658454": "Koreczki śledziowe \"Po szlachecku\" 3,2kg",
                    "5907632658263": "Koreczki śledziowe po \"Kaszubsku\" 1000g",
                    "5907632658270": "Koreczki śledziowe po \"Kaszubsku\" 3kg",
                    "5903240542062": "Koreczki śledziowe po \"Kaszubsku\" 450g",
                    "5907632658256": "Koreczki śledziowe po \"Kaszubsku\" 800g",
                    "5903240542321": "Kotlety rybne smażone 2kg",
                    "5903240542598": "Kręgosłupy z łososia 2kg",
                    "5903240542840": "ŁOSOŚ FILET WĘDZONY PREMIUM 2kg",
                    "5903240542925": "Łosoś ogonki z fileta wędzony 2kg",
                    "5903240542635": "Łosoś paski wędzony 2+ 3kg",
                    "5903240542604": "Łosoś sałatkowy wędzony na gorąco VAC 500g",
                    "5903240542161": "Łosoś z pistacjami wędzony 2kg",
                    "5903240542895": "Łosoś z przyprawami porcje premium 2kg",
                    "5903240542154": "Makrela pieczona 2kg",
                    "5903240542109": "Makrela wędzona 2kg",
                    "5903240542116": "Makrela wędzona 3kg",
                    "5903240542123": "Makrela wędzona 4kg",
                    "5903240542383": "Makrela wędzona B/D 4kg",
                    "5903240542314": "Makrela wędzona na zimno 4kg",
                    "5903240542512": "Maślana wędzona 2kg",
                    "5907632658010": "Matias filety śledziowe bez skóry PREMIUM 1.2kg",
                    "5907632658768": "Matias filety śledziowe bez skóry PREMIUM 12kg",
                    "5903240542758": "Matias filety śledziowe bez skóry PREMIUM 15kg",
                    "5903240542666": "Matias filety śledziowe bez skóry PREMIUM 1kg",
                    "5907632658027": "Matias filety śledziowe bez skóry PREMIUM 3.3kg",
                    "5907632658034": "Matias filety śledziowe bez skóry PREMIUM 3.5kg",
                    "5907632658751": "Matias filety śledziowe bez skóry PREMIUM 5.8kg",
                    "5907632658041": "Matias filety śledziowe bez skóry PREMIUM 5kg",
                    "5903240542802": "Matias filety śledziowe bez skóry PREMIUM 700g",
                    "5903240542581": "Miecznik wędzony 2kg",
                    "5907632658843": "Miętus wędzony 2kg",
                    "5903240542574": "MINI KOSTKA Z ŁOSOSIA WĘDZONA NA ZIMNO 2kg",
                    "5907632658812": "Miruna nowozelandzka VAC 1kg",
                    "5907632658836": "Miruna tusza wędzona 2kg",
                    "5907632658874": "MORSZCZUK ARGENTYŃSKI 1kg",
                    "5907632658829": "Morszczuk TUSZA wędzony 2kg",
                    "5903240542932": "Morszczuk wędzony 3kg",
                    "5903240542130": "Morszczuk wędzony DZWONEK 2kg",
                    "5907632658799": "Ostrobok wędzony 2kg",
                    "5903240542611": "Paski z łososia 3+ 3kg",
                    "5903240542628": "Paski z łososia 5+ 3kg",
                    "5903240542260": "Pikling wędzony 3kg",
                    "5903240542420": "Plamiak DZWONEK wędzony 3kg",
                    "5903240542352": "Płat śledziowy wędzony 2kg",
                    "5907632658553": "Płat z makreli z warzywami 2kg",
                    "5907632658805": "Płaty śledziowe marynowane 22kg",
                    "5907632658126": "Płaty śledziowe marynowane 3.3kg",
                    "5907632658133": "Płaty śledziowe marynowane 5.8kg",
                    "5907632658058": "Płaty śledziowe solone ze skórą 3.5kg",
                    "5903240542253": "Pstrąg wędzony 2kg",
                    "5907632658898": "Ryba po grecku 1kg",
                    "5903240542024": "Ryba po grecku 2kg",
                    "5907632658775": "Ryba po grecku 3kg",
                    "5903240542017": "Ryba po grecku 500g",
                    "5903240542291": "Ryba z pieca (makrela) 2kg",
                    "5903240542970": "Sardynka wędzona 2kg",
                    "5907632658102": "Sielawa wędzona 2kg",
                    "5903240542864": "Srebrzyk w zalewie octowej 1,5kg",
                    "5903240542222": "Szaszłyk z łososia z ananasem KRÓTKI 2kg",
                    "5903240542710": "Szaszłyk z łososia ze śliwką krótki 2kg",
                    "5903240542208": "Szaszłyki z łososia wędzone 2kg",
                    "5903240542178": "Szprot wędzony 2kg",
                    "5903240542338": "Szprot wędzony 3kg",
                    "5903240542659": "Szprot wędzony VAC tacka 200g",
                    "5903240542482": "Śledzik z grzybkami 1kg",
                    "5903240542468": "Śledzik z grzybkami 2kg",
                    "5903240542390": "Śledzik z grzybkami 450g",
                    "5903240542086": "Śledź b/g lekko solony dalekomorski 300+ 1.2kg",
                    "5903240542079": "Śledź b/g lekko solony dalekomorski 300+ 12kg",
                    "5907632658072": "Śledź b/g lekko solony dalekomorski 300+ 3.5kg",
                    "5907632658089": "Śledź b/g lekko solony dalekomorski 300+ 5.8kg",
                    "5907632658560": "Trewal wędzony 2kg",
                    "5907632658140": "Tuszka śledziowa marynowana Moskaliki 3.3kg",
                    "5903240542376": "Tuszka śledziowa wędzona 3kg",
                    "5903240542369": "Tuszki śledziowe wędzone 3kg",
                    "5907632658379": "Węgorz wędzony 2kg",
                    "5903240542499": "wolny 1kg",
                    "5903240542949": "wolny 200g",
                    "5903240542529": "wolny 450g",
                    "5903240542536": "wolny kod 2kg",
                    "5903240542048": "wolny2 450g",
                    "5903240542444": "wolny3 2kg",
                    "5907632658232": "Zawijaniec z łososia ze śliwką 2kg",
                    "5903240542345": "Zębacz filet wędzony 2kg",
                    "5903240542185": "Zębacz kawałki wędzone 2kg"
                };

                const savedProducts = localStorage.getItem('elmarCustomProducts');
                if (savedProducts) {
                    try {
                        const customProducts = JSON.parse(savedProducts);
                        Object.assign(this.productDatabase, customProducts);
                    } catch (error) {
                        console.error('Error loading custom products:', error);
                    }
                }
            }

            setupEventListeners() {
                document.getElementById('addDocumentBtn').addEventListener('click', () => {
                    this.showScreen('documentCreationScreen');
                });

                document.getElementById('viewDocumentsBtn').addEventListener('click', () => {
                    this.updateDocumentsList();
                    this.showScreen('documentsListScreen');
                });

                document.getElementById('manageDatabaseBtn').addEventListener('click', () => {
                    this.showScreen('databaseScreen');
                    this.updateDatabaseStats();
                });

                document.getElementById('helpBtn').addEventListener('click', () => {
                    this.showModal('helpModal');
                });

                document.getElementById('closeHelpBtn').addEventListener('click', () => {
                    this.hideModal('helpModal');
                });

                document.getElementById('documentForm').addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.createNewDocument();
                });

                document.getElementById('backToStartBtn').addEventListener('click', () => {
                    this.showScreen('startScreen');
                });

                document.getElementById('addProductBtn').addEventListener('click', () => {
                    this.startScanner();
                });

                document.getElementById('manualEntryBtn').addEventListener('click', () => {
                    this.showScreen('manualEntryScreen');
                    this.switchTab('barcode');
                });

                document.getElementById('endWithoutSaveBtn').addEventListener('click', () => {
                    if (confirm('Czy na pewno chcesz anulować? Wszystkie niezapisane produkty zostaną utracone.')) {
                        this.showScreen('startScreen');
                        this.currentDocument = null;
                    }
                });

                document.getElementById('finishAndSaveBtn').addEventListener('click', () => {
                    this.finishAndSaveDocument();
                });

                document.getElementById('cancelScanBtn').addEventListener('click', () => {
                    this.stopScanner();
                    this.showScreen('mainDocumentScreen');
                });

                document.getElementById('manualEntryScannerBtn').addEventListener('click', () => {
                    this.stopScanner();
                    this.showScreen('manualEntryScreen');
                });

                document.getElementById('manualEntryForm').addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleManualEntry();
                });

                document.getElementById('newProductDirectForm').addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleDirectNewProduct();
                });

                document.getElementById('cancelManualBtn').addEventListener('click', () => {
                    this.showScreen('mainDocumentScreen');
                });

                document.getElementById('productSearch').addEventListener('input', (e) => {
                    this.searchProducts(e.target.value);
                });

                document.getElementById('databaseSearch').addEventListener('input', (e) => {
                    this.searchDatabase(e.target.value);
                });

                document.getElementById('quantityForm').addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.addProductWithQuantity();
                });

                document.getElementById('cancelQuantityBtn').addEventListener('click', () => {
                    this.hideModal('quantityModal');
                });

                document.getElementById('newProductForm').addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.addNewProduct();
                });

                document.getElementById('cancelNewProductBtn').addEventListener('click', () => {
                    this.hideModal('newProductModal');
                });

                document.getElementById('editProductForm').addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.saveProductEdit();
                });

                document.getElementById('cancelEditProductBtn').addEventListener('click', () => {
                    this.hideModal('editProductModal');
                });

                document.getElementById('generatePdfBtn').addEventListener('click', () => {
                    this.generatePdf();
                });

                document.getElementById('sendToOfficeBtn').addEventListener('click', () => {
                    this.sendPdfToOffice();
                });

                document.getElementById('endWorkBtn').addEventListener('click', () => {
                    this.endWork();
                });

                document.getElementById('startAgainBtn').addEventListener('click', () => {
                    this.showScreen('startScreen');
                });

                document.getElementById('manualBarcode').addEventListener('input', (e) => {
                    this.validateBarcodeInput(e.target);
                });

                document.getElementById('directBarcode').addEventListener('input', (e) => {
                    this.validateDirectBarcodeInput(e.target);
                });

                document.getElementById('importFileInput').addEventListener('change', (e) => {
                    if (e.target.files[0]) {
                        this.handleFileImport(e.target.files[0]);
                    }
                });

            }

            showScreen(screenId) {
                // Scroll to top immediately for smooth transition
                window.scrollTo({ top: 0, behavior: 'smooth' });

                document.querySelectorAll('.screen').forEach(screen => {
                    screen.classList.remove('active');
                });

                const newScreen = document.getElementById(screenId);
                newScreen.classList.add('active');
                this.currentScreen = screenId;

                // Scroll the screen content to top as well
                newScreen.scrollTop = 0;

                setTimeout(() => {
                    const firstInput = newScreen.querySelector('input[type="text"], input[type="number"], textarea');
                    if (firstInput && !this.isMobile()) {
                        firstInput.focus();
                    }
                }, 100);
            }

            showModal(modalId) {
                // Close any previously open modals first
                const allModals = document.querySelectorAll('.modal.active');
                allModals.forEach(m => {
                    m.classList.remove('active');
                });

                // Scroll viewport to top so user sees the modal (which appears at top on mobile)
                window.scrollTo({ top: 0, behavior: 'instant' });
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;

                // Also scroll main document screen to top if exists
                const mainScreen = document.getElementById('mainDocumentScreen');
                if (mainScreen) {
                    mainScreen.scrollTop = 0;
                }

                const modal = document.getElementById(modalId);
                modal.classList.add('active');

                // Scroll both modal and modal-content to top
                modal.scrollTop = 0;
                const modalContent = modal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.scrollTop = 0;
                }

                // Prevent body scroll when modal is open
                document.body.style.overflow = 'hidden';

                setTimeout(() => {
                    const firstInput = modal.querySelector('input[type="text"], input[type="number"]');
                    if (firstInput) {
                        firstInput.focus();
                        firstInput.select();
                    }
                }, 100);
            }

            hideModal(modalId) {
                // Re-enable body scroll
                document.body.style.overflow = '';

                document.getElementById(modalId).classList.remove('active');
            }

            async createNewDocument() {
                const workerName = document.getElementById('workerName').value.trim();
                const date = document.getElementById('documentDate').value;
                const notes = document.getElementById('notes').value.trim();

                if (!workerName || !date) {
                    alert('Proszę wypełnić wszystkie wymagane pola');
                    return;
                }

                this.currentDocument = {
                    id: Date.now(),
                    worker: workerName,
                    date: date,
                    notes: notes,
                    products: [],
                    createdAt: new Date().toISOString()
                };

                document.getElementById('documentWorker').textContent = workerName;
                document.getElementById('documentDateDisplay').textContent = new Date(date).toLocaleDateString('pl-PL');

                // Poproś o dostęp do kamery już teraz (w tle)
                await this.requestCameraPermission();

                this.showScreen('mainDocumentScreen');
                this.updateProductsTable();
                this.saveToStorage();
            }

            async requestCameraPermission() {
                // Sprawdź czy już mamy uprawnienia
                if (this.cameraPermissionGranted) {
                    return true;
                }

                try {
                    // Spróbuj uzyskać dostęp do kamery
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: "environment" }
                    });

                    // Jeśli udało się - zatrzymaj strumień (użyjemy go później)
                    stream.getTracks().forEach(track => track.stop());

                    this.cameraPermissionGranted = true;
                    console.log('Dostęp do kamery przyznany');
                    return true;
                } catch (err) {
                    console.warn('Nie udało się uzyskać dostępu do kamery:', err);
                    this.cameraPermissionGranted = false;
                    return false;
                }
            }

            handleManualEntry() {
                const barcode = document.getElementById('manualBarcode').value;
                const quantity = parseInt(document.getElementById('manualQuantity').value);

                if (barcode.length !== 13) {
                    alert('Kod kreskowy musi mieć dokładnie 13 cyfr');
                    return;
                }

                if (!quantity || quantity < 1) {
                    alert('Ilość musi być większa od 0');
                    return;
                }

                this.showScreen('mainDocumentScreen');

                if (this.productDatabase[barcode]) {
                    this.currentBarcode = barcode;
                    document.getElementById('quantityProductName').textContent = this.productDatabase[barcode];
                    document.getElementById('productQuantity').value = quantity;
                    this.showModal('quantityModal');
                } else {
                    this.currentBarcode = barcode;
                    document.getElementById('unknownBarcode').textContent = barcode;
                    document.getElementById('newProductQuantity').value = quantity;
                    this.showModal('newProductModal');
                }
            }

            handleDirectNewProduct() {
                const barcode = document.getElementById('directBarcode').value;
                const productName = document.getElementById('directProductName').value.trim();
                const quantity = parseInt(document.getElementById('directQuantity').value);

                if (barcode.length !== 13) {
                    alert('Kod kreskowy musi mieć dokładnie 13 cyfr');
                    return;
                }

                if (!productName) {
                    alert('Proszę wprowadzić nazwę produktu');
                    return;
                }

                if (!quantity || quantity < 1) {
                    alert('Ilość musi być większa od 0');
                    return;
                }

                if (this.productDatabase[barcode]) {
                    if (!confirm(`Kod ${barcode} już istnieje w bazie jako "${this.productDatabase[barcode]}". Czy chcesz go zastąpić?`)) {
                        return;
                    }
                }

                this.productDatabase[barcode] = productName;
                this.saveCustomProductToStorage(barcode, productName);

                this.addProductToDocument(barcode, productName, quantity);
                this.clearDirectForm();
                this.showScreen('mainDocumentScreen');
                this.showNotification('Dodano nowy produkt do bazy i dokumentu', 'success');
            }

            switchTab(tabName) {
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

                document.getElementById(tabName + 'Tab').classList.add('active');
                document.getElementById(tabName + 'TabContent').classList.add('active');

                if (tabName === 'search') {
                    document.getElementById('searchResults').innerHTML = '';
                    setTimeout(() => document.getElementById('productSearch').focus(), 100);
                }
            }

            searchProducts(searchTerm) {
                const resultsContainer = document.getElementById('searchResults');

                if (!searchTerm || searchTerm.length < 2) {
                    resultsContainer.innerHTML = '';
                    return;
                }

                const results = this.findProductsByName(searchTerm);

                if (results.length === 0) {
                    resultsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 1rem;">Nie znaleziono produktów</p>';
                    return;
                }

                resultsContainer.innerHTML = results.slice(0, 10).map(result => `
                    <div class="search-result-item" onclick="app.selectSearchResult(this.dataset.barcode)" data-barcode="${this.escapeHtml(result.barcode)}">
                        <h5>${this.highlightSearchTerm(result.name, searchTerm)}</h5>
                        <p>Kod: ${this.escapeHtml(result.barcode)}</p>
                    </div>
                `).join('');
            }

            selectSearchResult(barcode) {
                this.currentBarcode = barcode;
                const productName = this.productDatabase[barcode] || 'Nieznany produkt';
                this.showScreen('mainDocumentScreen');
                document.getElementById('quantityProductName').textContent = productName;
                document.getElementById('productQuantity').value = 1;
                this.showModal('quantityModal');
            }

            findProductsByName(searchTerm) {
                const term = searchTerm.toLowerCase();
                const results = [];

                for (const [barcode, name] of Object.entries(this.productDatabase)) {
                    if (name.toLowerCase().includes(term) || barcode.includes(searchTerm)) {
                        results.push({ barcode, name });
                    }
                }

                return results.sort((a, b) => {
                    const aIndex = a.name.toLowerCase().indexOf(term);
                    const bIndex = b.name.toLowerCase().indexOf(term);
                    return aIndex - bIndex;
                });
            }

            highlightSearchTerm(text, term) {
                if (!term) return this.escapeHtml(text);
                const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const parts = text.split(new RegExp(`(${escapedTerm})`, 'gi'));
                return parts
                    .map((part) => {
                        if (part.toLowerCase() === term.toLowerCase()) {
                            return `<mark style="background: yellow; padding: 1px 2px;">${this.escapeHtml(part)}</mark>`;
                        }
                        return this.escapeHtml(part);
                    })
                    .join('');
            }

            updateDatabaseStats() {
                const totalProducts = Object.keys(this.productDatabase).length;
                const customProducts = this.getCustomProductCount();

                document.getElementById('productCount').textContent = totalProducts;
                document.getElementById('customProductCount').textContent = customProducts;
            }

            getCustomProductCount() {
                try {
                    const saved = localStorage.getItem('elmarCustomProducts');
                    return saved ? Object.keys(JSON.parse(saved)).length : 0;
                } catch (error) {
                    return 0;
                }
            }

            searchDatabase(searchTerm) {
                const resultsContainer = document.getElementById('databaseResults');

                if (!searchTerm || searchTerm.length < 2) {
                    resultsContainer.innerHTML = '';
                    return;
                }

                const results = this.findProductsByName(searchTerm);

                if (results.length === 0) {
                    resultsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 1rem;">Nie znaleziono produktów</p>';
                    return;
                }

                resultsContainer.innerHTML = results.slice(0, 20).map(result => {
                    const escapedBarcode = this.escapeHtml(result.barcode);
                    return `
                    <div class="database-item">
                        <div class="database-item-info">
                            <div class="database-item-code">${escapedBarcode}</div>
                            <div class="database-item-name">${this.highlightSearchTerm(result.name, searchTerm)}</div>
                        </div>
                        <div class="database-item-actions">
                            <button class="btn btn--sm btn--outline" data-barcode="${escapedBarcode}" onclick="app.editDatabaseProduct(this.dataset.barcode)">Edytuj</button>
                            ${this.isCustomProduct(result.barcode) ?
                                `<button class="btn btn--sm btn--secondary" data-barcode="${escapedBarcode}" onclick="app.deleteDatabaseProduct(this.dataset.barcode)">Usuń</button>` : ''}
                        </div>
                    </div>
                `}).join('');
            }

            isCustomProduct(barcode) {
                try {
                    const saved = localStorage.getItem('elmarCustomProducts');
                    if (saved) {
                        const customProducts = JSON.parse(saved);
                        return customProducts.hasOwnProperty(barcode);
                    }
                } catch (error) {
                    console.error('Error checking custom product:', error);
                }
                return false;
            }

            importProductDatabase() {
                document.getElementById('importFileInput').click();
            }

            async handleFileImport(file) {
                if (!file.name.match(/\.(xlsx|xls)$/)) {
                    alert('Proszę wybrać plik Excel (.xlsx lub .xls)');
                    return;
                }

                this.showLoadingOverlay('Importowanie produktów...');

                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    let importedCount = 0;
                    const importedProducts = {};

                    for (let i = 1; i < jsonData.length; i++) {
                        const row = jsonData[i];
                        if (row.length >= 2 && row[0] && row[1]) {
                            const barcode = String(row[0]).trim();
                            const name = String(row[1]).trim();

                            if (barcode.length === 13 && /^\d+$/.test(barcode) && name) {
                                importedProducts[barcode] = name;
                                importedCount++;
                            }
                        }
                    }

                    if (importedCount > 0) {
                        Object.assign(this.productDatabase, importedProducts);

                        Object.entries(importedProducts).forEach(([barcode, name]) => {
                            this.saveCustomProductToStorage(barcode, name);
                        });

                        this.hideLoadingOverlay();
                        this.updateDatabaseStats();
                        this.showNotification(`Zaimportowano ${importedCount} produktów`, 'success');
                    } else {
                        this.hideLoadingOverlay();
                        alert('Nie znaleziono prawidłowych danych do importu. Sprawdź format pliku.');
                    }
                } catch (error) {
                    this.hideLoadingOverlay();
                    console.error('Import error:', error);
                    alert('Wystąpił błąd podczas importu pliku');
                }

                document.getElementById('importFileInput').value = '';
            }

            exportProductDatabase() {
                try {
                    const wb = XLSX.utils.book_new();

                    const exportData = [['Kod kreskowy', 'Nazwa produktu']];

                    const sortedProducts = Object.entries(this.productDatabase)
                        .sort(([,a], [,b]) => a.localeCompare(b, 'pl'));

                    sortedProducts.forEach(([barcode, name]) => {
                        exportData.push([this.sanitizeForExcel(barcode), this.sanitizeForExcel(name)]);
                    });

                    const ws = XLSX.utils.aoa_to_sheet(exportData);

                    ws['!cols'] = [
                        { wch: 15 },
                        { wch: 50 }
                    ];

                    XLSX.utils.book_append_sheet(wb, ws, 'Produkty ELMAR');

                    const filename = `ELMAR_Baza_Produktow_${new Date().toISOString().split('T')[0]}.xlsx`;
                    XLSX.writeFile(wb, filename);

                    this.showNotification('Baza produktów została wyeksportowana', 'success');
                } catch (error) {
                    console.error('Export error:', error);
                    alert('Wystąpił błąd podczas eksportu bazy produktów');
                }
            }

            async startScanner() {
    this.showScreen('scannerScreen');
    try {
        await this.initializeScanner();
    } catch (err) {
        console.error(err);
        this.showCameraError();
    }
}

async initializeScanner() {
    const videoEl = document.createElement('video');
    const scannerContainer = document.querySelector('#scanner');
    scannerContainer.innerHTML = '';
    scannerContainer.appendChild(videoEl);

    // 1. Pobranie streamu z kamery - standardowe ustawienia bez zoom
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
            aspectRatio: { ideal: 16/9 }
        }
    });

    videoEl.srcObject = stream;
    await videoEl.play();

    // Dodaj ramkę celującą jak wcześniej
    this.addScannerOverlay();
    this.scannerActive = true;

    // 2. Jeśli jest BarcodeDetector – użyj go
    if ('BarcodeDetector' in window) {
        const detector = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'code_128'] });

        const scanFrame = async () => {
            if (!this.scannerActive) return;

            try {
                const barcodes = await detector.detect(videoEl);
                if (barcodes.length > 0) {
                    const code = barcodes[0].rawValue;
                    this.showScanSuccess();       // pokaż zielone podświetlenie
                    setTimeout(() => {
                        this.stopScanner();       // wyłącz kamerę po animacji
                        this.processBarcodeDetection(code);
                    }, 150);
                    return;
                }
            } catch (e) {
                console.warn('BarcodeDetector error, falling back to Quagga', e);
                // jeśli się wywali – lecimy dalej do Quaggi niżej
            }

            requestAnimationFrame(scanFrame);
        };

        requestAnimationFrame(scanFrame);
    } else {
        // 3. Fallback do Quagga, ale odchudzony
        return new Promise((resolve, reject) => {
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: scannerContainer,
                    constraints: {
                        facingMode: "environment",
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    }
                },
                locator: {
                    patchSize: "medium",
                    halfSample: true
                },
                decoder: {
                    readers: [
                        "ean_reader"           // tyle nam trzeba
                    ]
                },
                locate: true,
                numOfWorkers: navigator.hardwareConcurrency || 2
            }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                Quagga.start();
                this.scannerActive = true;

                Quagga.onDetected((data) => {
                    if (!this.scannerActive) return;
                    const code = data.codeResult.code;
                    if (this.isValidEAN13(code)) {
                        this.showScanSuccess();       // pokaż zielone podświetlenie
                        setTimeout(() => {
                            this.stopScanner();
                            this.processBarcodeDetection(code);
                        }, 150);
                    }
                });

                resolve();
            });
        });
    }
}


            addScannerOverlay() {
                const scanner = document.getElementById('scanner');
                const overlay = document.createElement('div');
                overlay.className = 'scanner-overlay';
                overlay.id = 'scannerOverlay';

                // Dodaj wszystkie cztery narożniki
                overlay.innerHTML = `
                    <div class="scanner-overlay-label" id="scannerOverlayLabel">Umieść kod w ramce</div>
                `;

                // Utwórz pozostałe narożniki poza pseudo-elementami
                const topRight = document.createElement('div');
                topRight.className = 'scanner-corners';
                overlay.appendChild(topRight);

                const bottomLeft = document.createElement('div');
                bottomLeft.className = 'scanner-corners-bottom-left';
                overlay.appendChild(bottomLeft);

                scanner.appendChild(overlay);
            }

            showScanSuccess() {
                const overlay = document.getElementById('scannerOverlay');
                const label = document.getElementById('scannerOverlayLabel');

                if (overlay) {
                    overlay.classList.add('scanning-success');
                }

                if (label) {
                    label.textContent = 'Kod zeskanowany!';
                    label.classList.add('success');
                }

                // Vibracja (jeśli dostępna)
                if (navigator.vibrate) {
                    navigator.vibrate(200);
                }
            }

            processBarcodeDetectionEnhanced(data) {
                const barcode = data.codeResult.code;
                const quality = data.codeResult.decodedCodes.reduce((sum, code) => sum + (code.error || 0), 0) / data.codeResult.decodedCodes.length;

                if (quality > 0.15) {
                    return;
                }

                if (!this.isValidEAN13(barcode)) {
                    return;
                }

                setTimeout(() => {
                    if (this.scannerActive) {
                        this.stopScanner();
                        this.processBarcodeDetection(barcode);
                    }
                }, 100);
            }

            isValidEAN13(barcode) {
                if (!/^\d{13}$/.test(barcode)) {
                    return false;
                }

                const digits = barcode.split('').map(Number);
                const checksum = digits.pop();

                let sum = 0;
                for (let i = 0; i < 12; i++) {
                    sum += digits[i] * (i % 2 === 0 ? 1 : 3);
                }

                const calculatedChecksum = (10 - (sum % 10)) % 10;
                return calculatedChecksum === checksum;
            }

            processBarcodeDetection(barcode) {
                if (barcode.length !== 13 || !/^\d+$/.test(barcode)) {
                    return;
                }

                this.stopScanner();
                this.showScreen('mainDocumentScreen');

                if (this.productDatabase[barcode]) {
                    this.currentBarcode = barcode;
                    document.getElementById('quantityProductName').textContent = this.productDatabase[barcode];
                    document.getElementById('productQuantity').value = 1;
                    this.showModal('quantityModal');
                } else {
                    this.currentBarcode = barcode;
                    document.getElementById('unknownBarcode').textContent = barcode;
                    document.getElementById('newProductQuantity').value = 1;
                    this.showModal('newProductModal');
                }
            }

            stopScanner() {
    this.scannerActive = false;

    // zatrzymaj Quaggę jeśli działa
    if (typeof Quagga !== 'undefined' && Quagga.stop) {
        try { Quagga.stop(); } catch (e) {}
    }

    // zatrzymaj strumień z video
    const scanner = document.querySelector('#scanner video');
    if (scanner && scanner.srcObject) {
        scanner.srcObject.getTracks().forEach(track => track.stop());
        scanner.srcObject = null;
    }
}

            showCameraError() {
                const scanner = document.getElementById('scanner');
                scanner.innerHTML = `
                    <div class="camera-error">
                        <h3>Błąd dostępu do kamery</h3>
                        <p>Nie można uruchomić kamery. Sprawdź uprawnienia lub użyj opcji ręcznego wprowadzania.</p>
                        <button class="btn btn--primary" onclick="app.showScreen('manualEntryScreen')">
                            Wprowadź ręcznie
                        </button>
                    </div>
                `;
            }

            validateBarcodeInput(input) {
                const value = input.value.replace(/\D/g, '').slice(0, 13);
                input.value = value;

                const statusElement = document.getElementById('barcodeStatus');

                if (value.length === 0) {
                    statusElement.innerHTML = '';
                    input.style.borderColor = '';
                    return;
                }

                if (value.length < 13) {
                    this.showBarcodeStatus(`Wpisano ${value.length}/13 cyfr`, 'warning');
                    input.style.borderColor = 'var(--elmar-warning)';
                } else if (value.length === 13) {
                    if (this.productDatabase[value]) {
                        this.showBarcodeStatus(`Produkt znaleziony: ${this.productDatabase[value]}`, 'success');
                        input.style.borderColor = 'var(--elmar-success)';
                    } else {
                        this.showBarcodeStatus('Kod nie istnieje w bazie - zostanie dodany jako nowy produkt', 'warning');
                        input.style.borderColor = 'var(--elmar-warning)';
                    }
                }
            }

            validateDirectBarcodeInput(input) {
                const value = input.value.replace(/\D/g, '').slice(0, 13);
                input.value = value;

                if (value.length === 13 && this.productDatabase[value]) {
                    input.style.borderColor = 'var(--elmar-error)';
                    const existingName = this.productDatabase[value];
                    input.title = `Kod już istnieje: ${existingName}`;
                } else if (value.length === 13) {
                    input.style.borderColor = 'var(--elmar-success)';
                    input.title = '';
                } else {
                    input.style.borderColor = '';
                    input.title = '';
                }
            }

            showBarcodeStatus(message, type) {
                const statusElement = document.getElementById('barcodeStatus');
                statusElement.innerHTML = message;
                statusElement.className = `input-status ${type}`;
            }

            clearDirectForm() {
                document.getElementById('directBarcode').value = '';
                document.getElementById('directProductName').value = '';
                document.getElementById('directQuantity').value = '1';
                document.getElementById('directBarcode').style.borderColor = '';
            }

            clearManualEntryForm() {
                document.getElementById('manualBarcode').value = '';
                document.getElementById('manualQuantity').value = '1';
                document.getElementById('manualBarcode').style.borderColor = '';
                document.getElementById('barcodeStatus').innerHTML = '';
                document.getElementById('productSearch').value = '';
                document.getElementById('searchResults').innerHTML = '';
            }

            editDatabaseProduct(barcode) {
                const currentName = this.productDatabase[barcode];
                const newName = prompt(`Edytuj nazwę produktu (${barcode}):`, currentName);

                if (newName && newName.trim() !== currentName) {
                    this.productDatabase[barcode] = newName.trim();
                    if (this.isCustomProduct(barcode)) {
                        this.saveCustomProductToStorage(barcode, newName.trim());
                    }
                    this.showNotification('Nazwa produktu została zaktualizowana', 'success');
                    const searchTerm = document.getElementById('databaseSearch').value;
                    if (searchTerm) {
                        this.searchDatabase(searchTerm);
                    }
                }
            }

            deleteDatabaseProduct(barcode) {
                const productName = this.productDatabase[barcode];
                if (confirm(`Czy na pewno chcesz usunąć produkt "${productName}" (${barcode}) z bazy?`)) {
                    delete this.productDatabase[barcode];
                    this.removeCustomProductFromStorage(barcode);
                    this.showNotification('Produkt został usunięty z bazy', 'success');
                    this.updateDatabaseStats();
                    const searchTerm = document.getElementById('databaseSearch').value;
                    if (searchTerm) {
                        this.searchDatabase(searchTerm);
                    }
                }
            }

            clearCustomProducts() {
                if (confirm('Czy na pewno chcesz usunąć wszystkie produkty dodane ręcznie? Tej operacji nie można cofnąć.')) {
                    try {
                        const saved = localStorage.getItem('elmarCustomProducts');
                        if (saved) {
                            const customProducts = JSON.parse(saved);
                            Object.keys(customProducts).forEach(barcode => {
                                delete this.productDatabase[barcode];
                            });
                            localStorage.removeItem('elmarCustomProducts');
                            this.updateDatabaseStats();
                            this.showNotification('Usunięto wszystkie produkty ręczne', 'success');
                        }
                    } catch (error) {
                        console.error('Error clearing custom products:', error);
                        alert('Wystąpił błąd podczas usuwania produktów');
                    }
                }
            }

            removeCustomProductFromStorage(barcode) {
                try {
                    let customProducts = {};
                    const saved = localStorage.getItem('elmarCustomProducts');
                    if (saved) {
                        customProducts = JSON.parse(saved);
                        delete customProducts[barcode];
                        localStorage.setItem('elmarCustomProducts', JSON.stringify(customProducts));
                    }
                } catch (error) {
                    console.error('Error removing custom product:', error);
                }
            }

            showLoadingOverlay(message) {
                const overlay = document.createElement('div');
                overlay.id = 'loadingOverlay';
                overlay.className = 'loading-overlay';
                overlay.innerHTML = `
                    <div class="loading-content">
                        <div class="loading"></div>
                        <p style="margin-top: 1rem;">${message}</p>
                    </div>
                `;
                document.body.appendChild(overlay);
            }

            hideLoadingOverlay() {
                const overlay = document.getElementById('loadingOverlay');
                if (overlay) {
                    overlay.remove();
                }
            }

            addProductWithQuantity() {
                const quantity = parseInt(document.getElementById('productQuantity').value);
                const expiryDate = document.getElementById('productExpiryDate').value;
                const productName = this.productDatabase[this.currentBarcode];

                if (!quantity || quantity < 1) {
                    alert('Ilość musi być większa od 0');
                    return;
                }

                if (!expiryDate) {
                    alert('Proszę wprowadzić termin ważności');
                    return;
                }

                this.addProductToDocument(this.currentBarcode, productName, quantity, expiryDate);
                this.hideModal('quantityModal');

                // Reset form
                document.getElementById('productExpiryDate').value = '';
                this.clearManualEntryForm();

                // Potwierdzenie dodania produktu
                this.showNotification('Produkt dodany pomyślnie', 'success');
            }

            addNewProduct() {
                const productName = document.getElementById('newProductName').value.trim();
                const quantity = parseInt(document.getElementById('newProductQuantity').value);
                const expiryDate = document.getElementById('newProductExpiryDate').value;

                if (!productName) {
                    alert('Proszę wprowadzić nazwę produktu');
                    return;
                }

                if (!quantity || quantity < 1) {
                    alert('Ilość musi być większa od 0');
                    return;
                }

                if (!expiryDate) {
                    alert('Proszę wprowadzić termin ważności');
                    return;
                }

                this.productDatabase[this.currentBarcode] = productName;
                this.saveCustomProductToStorage(this.currentBarcode, productName);

                this.addProductToDocument(this.currentBarcode, productName, quantity, expiryDate);
                this.hideModal('newProductModal');

                document.getElementById('newProductName').value = '';
                document.getElementById('newProductQuantity').value = '1';
                document.getElementById('newProductExpiryDate').value = '';
                this.clearManualEntryForm();

                // Potwierdzenie dodania produktu
                this.showNotification('Nowy produkt dodany pomyślnie', 'success');
            }

            addProductToDocument(barcode, productName, quantity, expiryDate) {
                if (!this.currentDocument) {
                    alert('Błąd: Brak aktywnego dokumentu');
                    return;
                }

                // Każdy produkt z innym terminem ważności to osobna pozycja
                const existingIndex = this.currentDocument.products.findIndex(p => p.barcode === barcode && p.expiryDate === expiryDate);

                if (existingIndex !== -1) {
                    this.currentDocument.products[existingIndex].quantity += quantity;
                    this.showNotification(`Zaktualizowano ilość produktu: ${productName}`, 'success');
                } else {
                    this.currentDocument.products.push({
                        barcode: barcode,
                        name: productName,
                        quantity: quantity,
                        expiryDate: expiryDate,
                        notes: '',
                        addedAt: new Date().toISOString()
                    });
                    this.showNotification(`Dodano produkt: ${productName}`, 'success');
                }

                this.updateProductsTable();
                this.saveToStorage();
            }

            updateProductsTable() {
                const tbody = document.getElementById('productsTableBody');
                const products = (this.currentDocument && this.currentDocument.products) || [];

                if (products.length === 0) {
                    tbody.innerHTML = `
                        <tr class="empty-state">
                            <td colspan="7">Brak produktów. Dodaj pierwszy produkt używając skanera lub wprowadź ręcznie.</td>
                        </tr>
                    `;
                    document.getElementById('finishAndSaveBtn').disabled = true;
                    return;
                }

                document.getElementById('finishAndSaveBtn').disabled = false;

                // Optimization: Use DocumentFragment and createElement for better performance and security
                const fragment = document.createDocumentFragment();

                products.forEach((product, index) => {
                    const tr = document.createElement('tr');

                    // LP
                    const tdLp = document.createElement('td');
                    tdLp.setAttribute('data-label', 'LP');
                    tdLp.textContent = index + 1;
                    tr.appendChild(tdLp);

                    // Name
                    const tdName = document.createElement('td');
                    tdName.setAttribute('data-label', 'Nazwa produktu');
                    tdName.textContent = product.name;
                    tr.appendChild(tdName);

                    // Barcode
                    const tdBarcode = document.createElement('td');
                    tdBarcode.setAttribute('data-label', 'Kod kreskowy');
                    tdBarcode.textContent = product.barcode;
                    tr.appendChild(tdBarcode);

                    // Quantity
                    const tdQuantity = document.createElement('td');
                    tdQuantity.setAttribute('data-label', 'Ilość');
                    tdQuantity.textContent = product.quantity;
                    tr.appendChild(tdQuantity);

                    // Expiry
                    const tdExpiry = document.createElement('td');
                    tdExpiry.setAttribute('data-label', 'Termin ważności');
                    tdExpiry.textContent = product.expiryDate ? this.formatDate(product.expiryDate) : '-';
                    tr.appendChild(tdExpiry);

                    // Notes
                    const tdNotes = document.createElement('td');
                    tdNotes.setAttribute('data-label', 'Uwagi');
                    tdNotes.className = 'product-notes';
                    if (product.notes) {
                        const span = document.createElement('span');
                        span.className = 'notes-preview';
                        span.title = product.notes;
                        span.textContent = product.notes.substring(0, 30) + (product.notes.length > 30 ? '...' : '');
                        tdNotes.appendChild(span);
                    } else {
                        const span = document.createElement('span');
                        span.className = 'notes-empty';
                        span.textContent = 'Brak uwag';
                        tdNotes.appendChild(span);
                    }
                    tr.appendChild(tdNotes);

                    // Actions
                    const tdActions = document.createElement('td');
                    tdActions.setAttribute('data-label', 'Akcje');
                    tdActions.className = 'product-actions';

                    const editBtn = document.createElement('button');
                    editBtn.className = 'btn btn--sm btn--outline';
                    editBtn.textContent = 'Edytuj';
                    editBtn.onclick = () => this.editProduct(index);
                    tdActions.appendChild(editBtn);

                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'btn btn--sm btn--secondary';
                    removeBtn.textContent = 'Usuń';
                    removeBtn.onclick = () => this.removeProduct(index);
                    tdActions.appendChild(removeBtn);

                    tr.appendChild(tdActions);

                    fragment.appendChild(tr);
                });

                // Fast clear and append
                tbody.textContent = '';
                tbody.appendChild(fragment);
            }

            formatDate(dateString) {
                if (!dateString) return '-';
                const date = new Date(dateString);
                return date.toLocaleDateString('pl-PL');
            }

            editProduct(index) {
                if (!this.currentDocument || !this.currentDocument.products[index]) {
                    return;
                }

                const product = this.currentDocument.products[index];

                // Store the index we're editing
                this.currentEditIndex = index;

                // Populate the modal with product data
                document.getElementById('editProductName').textContent = product.name;
                document.getElementById('editProductQuantity').value = product.quantity;
                document.getElementById('editProductExpiryDate').value = product.expiryDate || '';
                document.getElementById('editProductNotes').value = product.notes || '';

                // Show the modal
                this.showModal('editProductModal');
            }

            saveProductEdit() {
                if (!this.currentDocument || this.currentEditIndex === undefined) {
                    return;
                }

                const quantity = parseInt(document.getElementById('editProductQuantity').value);
                const expiryDate = document.getElementById('editProductExpiryDate').value;
                const notes = document.getElementById('editProductNotes').value.trim();

                if (!quantity || quantity < 1) {
                    alert('Ilość musi być większa od 0');
                    return;
                }

                if (!expiryDate) {
                    alert('Proszę wprowadzić termin ważności');
                    return;
                }

                // Update product
                this.currentDocument.products[this.currentEditIndex].quantity = quantity;
                this.currentDocument.products[this.currentEditIndex].expiryDate = expiryDate;
                this.currentDocument.products[this.currentEditIndex].notes = notes;

                // Update table and save
                this.updateProductsTable();
                this.saveToStorage();

                // Hide modal and clear edit index
                this.hideModal('editProductModal');
                this.currentEditIndex = undefined;

                this.showNotification('Zaktualizowano produkt', 'success');
            }

            removeProduct(index) {
                if (!this.currentDocument || !this.currentDocument.products[index]) {
                    return;
                }

                const product = this.currentDocument.products[index];
                if (confirm(`Czy na pewno chcesz usunąć: ${product.name}?`)) {
                    this.currentDocument.products.splice(index, 1);
                    this.updateProductsTable();
                    this.saveToStorage();
                    this.showNotification('Usunięto produkt', 'success');
                }
            }

                       finishAndSaveDocument() {
                if (!this.currentDocument || this.currentDocument.products.length === 0) {
                    alert('Dodaj przynajmniej jeden produkt przed zakończeniem');
                    return;
                }

                // Add final timestamp
                this.currentDocument.completedAt = new Date().toISOString();

                // Sprawdź czy to edycja istniejącego dokumentu czy nowy
                const existingIndex = this.documents.findIndex(d => d.id === this.currentDocument.id);

                if (existingIndex !== -1) {
                    // Edycja istniejącego dokumentu
                    this.documents[existingIndex] = {...this.currentDocument};
                    this.showNotification('Dokument zaktualizowany pomyślnie', 'success');
                } else {
                    // Nowy dokument
                    this.documents.push({...this.currentDocument});
                    this.showNotification('Dokument zapisany pomyślnie', 'success');
                }

                this.saveToStorage();

                // Clear current document
                this.currentDocument = null;

                // Reset form for next use
                this.resetDocumentForm();

                this.updateDocumentsList();
                this.showScreen('documentsListScreen');
            }

            updateDocumentsList() {
                const container = document.getElementById('documentsList');
                const toggleBtn = document.getElementById('toggleAllDocsBtn');

                // Filtruj dokumenty w zależności od stanu showAllDocuments
                let docsToShow = this.documents;
                if (!this.showAllDocuments) {
                    const today = new Date().toISOString().split('T')[0];
                    docsToShow = this.documents.filter(doc => doc.date === today);
                }

                // Sortuj dokumenty od najnowszych (po dacie dokumentu, potem po id)
                const sortedDocs = [...docsToShow].sort((a, b) => {
                    // Najpierw sortuj po dacie dokumentu (malejąco)
                    const dateCompare = new Date(b.date) - new Date(a.date);
                    if (dateCompare !== 0) return dateCompare;
                    // Jeśli daty są takie same, sortuj po id (malejąco)
                    return b.id - a.id;
                });

                // Aktualizuj tekst przycisku
                if (toggleBtn) {
                    const hiddenCount = this.documents.length - docsToShow.length;
                    if (this.showAllDocuments) {
                        toggleBtn.textContent = 'Pokaż tylko dzisiejsze';
                        toggleBtn.className = 'btn btn--outline';
                    } else {
                        if (hiddenCount > 0) {
                            toggleBtn.textContent = `Pokaż wszystkie dokumenty (${this.documents.length})`;
                            toggleBtn.className = 'btn btn--secondary';
                        } else {
                            toggleBtn.textContent = 'Pokaż wszystkie dokumenty';
                            toggleBtn.className = 'btn btn--outline';
                        }
                    }
                }

                if (sortedDocs.length === 0) {
                    const message = this.showAllDocuments ? 'Brak dokumentów' : 'Brak dokumentów z dzisiejszej daty';
                    container.innerHTML = `<div class="empty-state" style="text-align: center; padding: 2rem;">${message}</div>`;
                } else {
                    container.innerHTML = sortedDocs.map(doc => `
                        <div class="document-item">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                                <h4 style="margin: 0;">Dokument wydania #${doc.id}</h4>
                                <div style="display: flex; gap: 0.5rem;">
                                    <button class="btn btn--sm btn--outline" onclick="app.viewDocument('${doc.id}')" title="Podgląd">
                                        Podgląd
                                    </button>
                                    <button class="btn btn--sm btn--outline" onclick="app.editDocument('${doc.id}')" title="Edytuj">
                                        Edytuj
                                    </button>
                                    <button class="btn btn--sm btn--outline" onclick="app.deleteDocument('${doc.id}')" style="color: var(--elmar-error); border-color: var(--elmar-error);" title="Usuń">
                                        Usuń
                                    </button>
                                </div>
                            </div>
                            <p><strong>Magazynier:</strong> ${this.escapeHtml(doc.worker)}</p>
                            <p><strong>Data:</strong> ${new Date(doc.date).toLocaleDateString('pl-PL')}</p>
                            ${doc.notes ? `<p><strong>Uwagi:</strong> ${this.escapeHtml(doc.notes)}</p>` : ''}
                            <div class="document-products">
                                <strong>Produkty:</strong> ${doc.products.length} pozycji,
                                łącznie ${doc.products.reduce((sum, p) => sum + p.quantity, 0)} sztuk
                            </div>
                            <p style="font-size: 0.9rem; color: #666; margin-top: 1rem;">
                                Utworzono: ${new Date(doc.createdAt).toLocaleString('pl-PL')}
                            </p>
                        </div>
                    `).join('');
                }
            }

            viewDocument(docId) {
                // Konwertuj docId na number (przychodzi jako string z HTML)
                const numericId = Number(docId);
                const doc = this.documents.find(d => d.id === numericId);
                if (!doc) {
                    alert('Nie znaleziono dokumentu');
                    return;
                }

                // Przygotowanie szczegółowego widoku
                let detailsHtml = `
                    <div style="background: white; padding: 20px; border-radius: 8px; max-width: 600px;">
                        <h3 style="color: var(--elmar-primary); margin-bottom: 1rem;">Dokument wydania #${doc.id}</h3>

                        <div style="background: var(--elmar-background); padding: 15px; border-radius: 5px; margin-bottom: 1rem;">
                            <p><strong>Magazynier:</strong> ${this.escapeHtml(doc.worker)}</p>
                            <p><strong>Data:</strong> ${new Date(doc.date).toLocaleDateString('pl-PL')}</p>
                            <p><strong>Utworzono:</strong> ${new Date(doc.createdAt).toLocaleString('pl-PL')}</p>
                            ${doc.notes ? `<p><strong>Uwagi:</strong> ${this.escapeHtml(doc.notes)}</p>` : ''}
                        </div>

                        <h4 style="margin: 1.5rem 0 1rem;">Produkty (${doc.products.length})</h4>
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                            <thead>
                                <tr style="background: var(--elmar-primary); color: white;">
                                    <th style="padding: 8px; text-align: left;">LP</th>
                                    <th style="padding: 8px; text-align: left;">Nazwa produktu</th>
                                    <th style="padding: 8px; text-align: center;">Ilość</th>
                                    <th style="padding: 8px; text-align: center;">Termin ważn.</th>
                                    <th style="padding: 8px; text-align: left;">Uwagi</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${doc.products.map((product, index) => `
                                    <tr style="border-bottom: 1px solid #ddd;">
                                        <td style="padding: 8px;">${index + 1}</td>
                                        <td style="padding: 8px;">${this.escapeHtml(product.name)}</td>
                                        <td style="padding: 8px; text-align: center; font-weight: 500;">${product.quantity}</td>
                                        <td style="padding: 8px; text-align: center;">${product.expiryDate ? new Date(product.expiryDate).toLocaleDateString('pl-PL') : '-'}</td>
                                        <td style="padding: 8px; font-size: 0.85rem; color: #666;">${product.notes ? this.escapeHtml(product.notes) : '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                            <tfoot>
                                <tr style="background: var(--elmar-background); font-weight: bold;">
                                    <td colspan="4" style="padding: 8px;">SUMA:</td>
                                    <td style="padding: 8px; text-align: center;">${doc.products.reduce((sum, p) => sum + p.quantity, 0)} szt.</td>
                                </tr>
                            </tfoot>
                        </table>

                        <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
                            <button class="btn btn--outline" onclick="app.closeDynamicModal(this)">Zamknij</button>
                        </div>
                    </div>
                `;

                this.showDynamicModal(detailsHtml);
            }

            editDocument(docId) {
                // Konwertuj docId na number (przychodzi jako string z HTML)
                const numericId = Number(docId);
                const doc = this.documents.find(d => d.id === numericId);
                if (!doc) {
                    alert('Nie znaleziono dokumentu');
                    return;
                }

                if (this.currentDocument && this.currentDocument.products.length > 0) {
                    if (!confirm('Masz niezapisany dokument. Czy chcesz go porzucić i edytować wybrany dokument?')) {
                        return;
                    }
                }

                // Załaduj dokument do edycji
                this.currentDocument = { ...doc };

                // Wypełnij wyświetlane informacje o dokumencie
                document.getElementById('documentWorker').textContent = doc.worker;
                document.getElementById('documentDateDisplay').textContent = new Date(doc.date).toLocaleDateString('pl-PL');

                // Przejdź do ekranu edycji dokumentu
                this.showScreen('mainDocumentScreen');
                this.updateProductsTable();
                this.saveToStorage();

                this.showNotification('Dokument załadowany do edycji', 'info');
            }

            deleteDocument(docId) {
                // Konwertuj docId na number (przychodzi jako string z HTML)
                const numericId = Number(docId);
                const doc = this.documents.find(d => d.id === numericId);
                if (!doc) {
                    alert('Nie znaleziono dokumentu');
                    return;
                }

                const confirmMsg = `Czy na pewno chcesz usunąć dokument #${doc.id}?\n\nMagazynier: ${doc.worker}\nData: ${new Date(doc.date).toLocaleDateString('pl-PL')}\nProdukty: ${doc.products.length} pozycji`;

                if (!confirm(confirmMsg)) {
                    return;
                }

                // Usuń dokument
                this.documents = this.documents.filter(d => d.id !== numericId);
                this.saveToStorage();
                this.updateDocumentsList();

                this.showNotification('Dokument został usunięty', 'success');
            }

            generatePdf() {
                if (this.documents.length === 0) {
                    alert('Brak dokumentów do wygenerowania');
                    return;
                }

                // Sortuj dokumenty od najnowszych
                const sortedDocs = [...this.documents].sort((a, b) => {
                    const dateCompare = new Date(b.date) - new Date(a.date);
                    if (dateCompare !== 0) return dateCompare;
                    return b.id - a.id;
                });

                // Jeśli jest tylko 1 dokument - generuj od razu
                if (sortedDocs.length === 1) {
                    this.generatePdfForDocs(sortedDocs);
                    return;
                }

                // Pokaż wybór wszystkich dokumentów
                this.showDocumentSelectionModal(sortedDocs, 'generate');
            }

            showDocumentSelectionModal(docs, action) {
                const actionText = action === 'generate' ? 'Generuj PDF' : 'Wyślij do biura';
                const modalHtml = `
                    <div style="background: white; padding: var(--space-xl); border-radius: var(--radius-lg); max-width: 600px;">
                        <h3 style="color: var(--elmar-primary); margin-bottom: var(--space-md);">Wybierz dokumenty</h3>
                        <p style="margin-bottom: var(--space-md); color: var(--text-secondary);">Zaznacz dokumenty, które chcesz ${action === 'generate' ? 'wygenerować' : 'wysłać'}:</p>

                        <div id="docSelectionList" style="max-height: 400px; overflow-y: auto; margin-bottom: var(--space-md);">
                            ${docs.map((doc, index) => `
                                <label style="display: block; padding: 12px; background: var(--elmar-background); margin-bottom: 8px; border-radius: 5px; cursor: pointer; border: 2px solid transparent;"
                                       onmouseover="this.style.borderColor='var(--elmar-primary)'"
                                       onmouseout="this.style.borderColor='transparent'">
                                    <input type="checkbox" value="${doc.id}" ${index === 0 ? 'checked' : ''}
                                           style="margin-right: 10px; transform: scale(1.2);">
                                    <strong>Dokument #${doc.id}</strong>
                                    <div style="font-size: 0.9rem; margin-left: 28px; margin-top: 5px; color: #666;">
                                        ${this.escapeHtml(doc.worker)} |
                                        ${doc.products.length} produktów (${doc.products.reduce((sum, p) => sum + p.quantity, 0)} szt.)
                                        ${doc.notes ? '<br>' + this.escapeHtml(doc.notes) : ''}
                                    </div>
                                </label>
                            `).join('')}
                        </div>

                        <div style="display: flex; gap: 0.5rem; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                            <label style="font-size: 0.9rem; color: #666; cursor: pointer;">
                                <input type="checkbox" id="selectAllDocs" onchange="
                                    const checkboxes = document.querySelectorAll('#docSelectionList input[type=checkbox]');
                                    checkboxes.forEach(cb => cb.checked = this.checked);
                                " style="margin-right: 5px;">
                                Zaznacz wszystkie
                            </label>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="btn btn--outline" onclick="app.closeDynamicModal(this)">Anuluj</button>
                                <button class="btn btn--primary" onclick="
                                    const checkboxes = Array.from(document.querySelectorAll('#docSelectionList input[type=checkbox]:checked'));
                                    const selectedIds = checkboxes.map(cb => Number(cb.value));
                                    if (selectedIds.length === 0) {
                                        alert('Wybierz przynajmniej jeden dokument');
                                        return;
                                    }
                                    const selectedDocs = app.documents.filter(d => selectedIds.includes(d.id));
                                    app.closeDynamicModal(this);
                                    if ('${action}' === 'generate') {
                                        app.generatePdfForDocs(selectedDocs);
                                    } else {
                                        app.sendPdfToOfficeForDocs(selectedDocs);
                                    }
                                ">${actionText}</button>
                            </div>
                        </div>
                    </div>
                `;

                this.showDynamicModal(modalHtml);
            }

            generatePdfForDocs(selectedDocs) {
                try {
                    const { jsPDF } = window.jspdf;

                    // Funkcja formatująca datę
                    const formatDateForPdf = (dateString) => {
                        if (!dateString) return '-';
                        return new Date(dateString).toLocaleDateString('pl-PL');
                    };

                    // Funkcja konwertująca polskie znaki na łacińskie (wymagane dla standardowych czcionek PDF)
                    const removePolishChars = (text) => {
                        if (!text) return text;
                        const polishMap = {
                            'ą': 'a', 'Ą': 'A',
                            'ć': 'c', 'Ć': 'C',
                            'ę': 'e', 'Ę': 'E',
                            'ł': 'l', 'Ł': 'L',
                            'ń': 'n', 'Ń': 'N',
                            'ó': 'o', 'Ó': 'O',
                            'ś': 's', 'Ś': 'S',
                            'ź': 'z', 'Ź': 'Z',
                            'ż': 'z', 'Ż': 'Z'
                        };
                        return text.replace(/[ąĄćĆęĘłŁńŃóÓśŚźŹżŻ]/g, char => polishMap[char] || char);
                    };

                    // Funkcja pomocnicza do generowania kodu kreskowego jako obrazu
                    const generateBarcodeImage = (barcode) => {
                        if (!barcode || barcode.length < 12) {
                            return null;
                        }

                        const canvas = document.createElement('canvas');
                        try {
                            // Sprawdź czy JsBarcode jest dostępny
                            if (typeof JsBarcode === 'undefined') {
                                console.warn('JsBarcode nie jest załadowany');
                                return null;
                            }

                            JsBarcode(canvas, barcode, {
                                format: "EAN13",
                                width: 2,
                                height: 40,
                                displayValue: false,
                                margin: 0
                            });
                            return canvas.toDataURL('image/png');
                        } catch (error) {
                            console.error('Błąd generowania kodu kreskowego dla:', barcode, error);
                            return null;
                        }
                    };

                    const doc = new jsPDF('p', 'mm', 'a4');

                    selectedDocs.forEach((document, docIndex) => {
                        if (docIndex > 0) {
                            doc.addPage();
                        }

                        // Nagłówek
                        doc.setFontSize(18);
                        doc.setTextColor(4, 98, 118);
                        doc.text('ELMAR - Dokument Wydania', 105, 20, { align: 'center' });

                        // Informacje podstawowe
                        doc.setFontSize(11);
                        doc.setTextColor(0, 0, 0);
                        let yPos = 40;

                        doc.text('Magazynier: ' + removePolishChars(document.worker), 20, yPos);
                        yPos += 7;
                        doc.text('Data: ' + new Date(document.date).toLocaleDateString('pl-PL'), 20, yPos);
                        yPos += 7;
                        doc.text('Utworzono: ' + new Date(document.createdAt).toLocaleString('pl-PL'), 20, yPos);
                        yPos += 7;
                        doc.text('Ostatnia modyfikacja: ' + new Date().toLocaleString('pl-PL'), 20, yPos);

                        if (document.notes) {
                            yPos += 7;
                            doc.text('Uwagi: ' + removePolishChars(document.notes), 20, yPos);
                        }

                        yPos += 15;

                        // Przygotuj dane tabeli z kodami kreskowymi
                        const tableData = [];
                        const barcodeImages = [];

                        document.products.forEach((product, index) => {
                            const barcodeImage = generateBarcodeImage(product.barcode);
                            barcodeImages.push(barcodeImage);

                            // Format expiry date for PDF
                            const expiryDateFormatted = product.expiryDate
                                ? new Date(product.expiryDate).toLocaleDateString('pl-PL')
                                : '-';

                            tableData.push([
                                index + 1,
                                removePolishChars(product.name),
                                product.quantity,
                                expiryDateFormatted,
                                product.barcode,
                                '', // Placeholder dla kodu graficznego
                                product.notes ? removePolishChars(product.notes) : '-'
                            ]);
                        });

                        // Tabela produktów z kolumną dla graficznego kodu kreskowego
                        // Szerokość strony A4: 210mm, z marginesami (10mm z każdej strony) = 190mm dostępne
                        doc.autoTable({
                            startY: yPos,
                            head: [['LP', 'Nazwa produktu', 'Ilosc', 'Termin wazn.', 'Kod kreskowy', 'Kod graficzny', 'Uwagi']],
                            body: tableData,
                            theme: 'grid',
                            styles: {
                                font: 'helvetica',
                                fontStyle: 'normal'
                            },
                            headStyles: {
                                fillColor: [4, 98, 118],
                                textColor: 255,
                                fontSize: 8,
                                fontStyle: 'bold',
                                halign: 'center',
                                minCellHeight: 12
                            },
                            bodyStyles: {
                                fontSize: 7,
                                minCellHeight: 12,
                                cellPadding: 2
                            },
                            columnStyles: {
                                0: { cellWidth: 8, halign: 'center' },       // LP
                                1: { cellWidth: 50 },                         // Nazwa
                                2: { cellWidth: 12, halign: 'center' },       // Ilość
                                3: { cellWidth: 22, halign: 'center' },       // Termin ważności
                                4: { cellWidth: 26, halign: 'center', fontSize: 6 }, // Kod kreskowy
                                5: { cellWidth: 36, halign: 'center' },       // Kod graficzny
                                6: { cellWidth: 36, fontSize: 6 }             // Uwagi
                            },
                            margin: { left: 10, right: 10 },
                            didDrawCell: function(data) {
                                // Rysuj kod kreskowy w kolumnie "Kod graficzny" (indeks 5)
                                if (data.section === 'body' && data.column.index === 5) {
                                    const barcodeImage = barcodeImages[data.row.index];
                                    if (barcodeImage) {
                                        try {
                                            // Wycentruj kod kreskowy w komórce
                                            const imgWidth = 34;
                                            const imgHeight = 8;
                                            const xPos = data.cell.x + (data.cell.width - imgWidth) / 2;
                                            const yPos = data.cell.y + (data.cell.height - imgHeight) / 2;

                                            doc.addImage(
                                                barcodeImage,
                                                'PNG',
                                                xPos,
                                                yPos,
                                                imgWidth,
                                                imgHeight
                                            );
                                        } catch (error) {
                                            console.error('Błąd dodawania obrazu kodu kreskowego:', error);
                                        }
                                    }
                                }
                            }
                        });

                        // Podsumowanie
                        const finalY = doc.lastAutoTable.finalY + 10;
                        doc.setFontSize(11);
                        doc.setFont(undefined, 'bold');
                        doc.text('PODSUMOWANIE', 20, finalY);

                        doc.setFont(undefined, 'normal');
                        doc.text('Laczna liczba pozycji: ' + document.products.length, 20, finalY + 7);
                        doc.text('Laczna liczba sztuk: ' + document.products.reduce((sum, p) => sum + p.quantity, 0), 20, finalY + 14);
                    });

                    const filename = 'ELMAR_Dokumenty_' + new Date().toISOString().split('T')[0] + '.pdf';
                    doc.save(filename);
                    this.showNotification('Plik PDF został wygenerowany', 'success');
                } catch (error) {
                    console.error('Błąd podczas generowania PDF:', error);
                    console.error('Stack trace:', error.stack);
                    alert('Wystąpił błąd podczas generowania pliku PDF: ' + error.message);
                }
            }

            async sendPdfToOffice() {
                if (this.documents.length === 0) {
                    alert('Brak dokumentów do wysłania');
                    return;
                }

                // Sortuj dokumenty od najnowszych
                const sortedDocs = [...this.documents].sort((a, b) => {
                    const dateCompare = new Date(b.date) - new Date(a.date);
                    if (dateCompare !== 0) return dateCompare;
                    return b.id - a.id;
                });

                // Jeśli jest tylko 1 dokument - wyślij od razu
                if (sortedDocs.length === 1) {
                    await this.sendPdfToOfficeForDocs(sortedDocs);
                    return;
                }

                // Jeśli więcej - pokaż wybór
                this.showDocumentSelectionModal(sortedDocs, 'send');
            }

            async sendPdfToOfficeForDocs(selectedDocs) {
                try {
                    // Wyświetl komunikat ładowania
                    this.showNotification('Wysyłanie pliku PDF...', 'info');

                    const { jsPDF } = window.jspdf;

                    // Funkcja konwertująca polskie znaki na łacińskie (wymagane dla standardowych czcionek PDF)
                    const removePolishChars = (text) => {
                        if (!text) return text;
                        const polishMap = {
                            'ą': 'a', 'Ą': 'A',
                            'ć': 'c', 'Ć': 'C',
                            'ę': 'e', 'Ę': 'E',
                            'ł': 'l', 'Ł': 'L',
                            'ń': 'n', 'Ń': 'N',
                            'ó': 'o', 'Ó': 'O',
                            'ś': 's', 'Ś': 'S',
                            'ź': 'z', 'Ź': 'Z',
                            'ż': 'z', 'Ż': 'Z'
                        };
                        return text.replace(/[ąĄćĆęĘłŁńŃóÓśŚźŹżŻ]/g, char => polishMap[char] || char);
                    };

                    // Funkcja pomocnicza do generowania kodu kreskowego jako obrazu
                    const generateBarcodeImage = (barcode) => {
                        if (!barcode || barcode.length < 12) {
                            return null;
                        }

                        const canvas = document.createElement('canvas');
                        try {
                            // Sprawdź czy JsBarcode jest dostępny
                            if (typeof JsBarcode === 'undefined') {
                                console.warn('JsBarcode nie jest załadowany');
                                return null;
                            }

                            JsBarcode(canvas, barcode, {
                                format: "EAN13",
                                width: 2,
                                height: 40,
                                displayValue: false,
                                margin: 0
                            });
                            return canvas.toDataURL('image/png');
                        } catch (error) {
                            console.error('Błąd generowania kodu kreskowego dla:', barcode, error);
                            return null;
                        }
                    };

                    const doc = new jsPDF('p', 'mm', 'a4');

                    selectedDocs.forEach((document, docIndex) => {
                        if (docIndex > 0) {
                            doc.addPage();
                        }

                        // Nagłówek
                        doc.setFontSize(18);
                        doc.setTextColor(4, 98, 118);
                        doc.text('ELMAR - Dokument Wydania', 105, 20, { align: 'center' });

                        // Informacje podstawowe
                        doc.setFontSize(11);
                        doc.setTextColor(0, 0, 0);
                        let yPos = 40;

                        doc.text('Magazynier: ' + removePolishChars(document.worker), 20, yPos);
                        yPos += 7;
                        doc.text('Data: ' + new Date(document.date).toLocaleDateString('pl-PL'), 20, yPos);
                        yPos += 7;
                        doc.text('Utworzono: ' + new Date(document.createdAt).toLocaleString('pl-PL'), 20, yPos);
                        yPos += 7;
                        doc.text('Ostatnia modyfikacja: ' + new Date().toLocaleString('pl-PL'), 20, yPos);

                        if (document.notes) {
                            yPos += 7;
                            doc.text('Uwagi: ' + removePolishChars(document.notes), 20, yPos);
                        }

                        yPos += 15;

                        // Przygotuj dane tabeli z kodami kreskowymi
                        const tableData = [];
                        const barcodeImages = [];

                        document.products.forEach((product, index) => {
                            const barcodeImage = generateBarcodeImage(product.barcode);
                            barcodeImages.push(barcodeImage);

                            // Format expiry date for PDF
                            const expiryDateFormatted = product.expiryDate
                                ? new Date(product.expiryDate).toLocaleDateString('pl-PL')
                                : '-';

                            tableData.push([
                                index + 1,
                                removePolishChars(product.name),
                                product.quantity,
                                expiryDateFormatted,
                                product.barcode,
                                '', // Placeholder dla kodu graficznego
                                product.notes ? removePolishChars(product.notes) : '-'
                            ]);
                        });

                        // Tabela produktów z kolumną dla graficznego kodu kreskowego
                        // Szerokość strony A4: 210mm, z marginesami (10mm z każdej strony) = 190mm dostępne
                        doc.autoTable({
                            startY: yPos,
                            head: [['LP', 'Nazwa produktu', 'Ilosc', 'Termin wazn.', 'Kod kreskowy', 'Kod graficzny', 'Uwagi']],
                            body: tableData,
                            theme: 'grid',
                            styles: {
                                font: 'helvetica',
                                fontStyle: 'normal'
                            },
                            headStyles: {
                                fillColor: [4, 98, 118],
                                textColor: 255,
                                fontSize: 8,
                                fontStyle: 'bold',
                                halign: 'center',
                                minCellHeight: 12
                            },
                            bodyStyles: {
                                fontSize: 7,
                                minCellHeight: 12,
                                cellPadding: 2
                            },
                            columnStyles: {
                                0: { cellWidth: 8, halign: 'center' },       // LP
                                1: { cellWidth: 50 },                         // Nazwa
                                2: { cellWidth: 12, halign: 'center' },       // Ilość
                                3: { cellWidth: 22, halign: 'center' },       // Termin ważności
                                4: { cellWidth: 26, halign: 'center', fontSize: 6 }, // Kod kreskowy
                                5: { cellWidth: 36, halign: 'center' },       // Kod graficzny
                                6: { cellWidth: 36, fontSize: 6 }             // Uwagi
                            },
                            margin: { left: 10, right: 10 },
                            didDrawCell: function(data) {
                                // Rysuj kod kreskowy w kolumnie "Kod graficzny" (indeks 5)
                                if (data.section === 'body' && data.column.index === 5) {
                                    const barcodeImage = barcodeImages[data.row.index];
                                    if (barcodeImage) {
                                        try {
                                            // Wycentruj kod kreskowy w komórce
                                            const imgWidth = 34;
                                            const imgHeight = 8;
                                            const xPos = data.cell.x + (data.cell.width - imgWidth) / 2;
                                            const yPos = data.cell.y + (data.cell.height - imgHeight) / 2;

                                            doc.addImage(
                                                barcodeImage,
                                                'PNG',
                                                xPos,
                                                yPos,
                                                imgWidth,
                                                imgHeight
                                            );
                                        } catch (error) {
                                            console.error('Błąd dodawania obrazu kodu kreskowego:', error);
                                        }
                                    }
                                }
                            }
                        });

                        // Podsumowanie
                        const finalY = doc.lastAutoTable.finalY + 10;
                        doc.setFontSize(11);
                        doc.setFont(undefined, 'bold');
                        doc.text('PODSUMOWANIE', 20, finalY);

                        doc.setFont(undefined, 'normal');
                        doc.text('Laczna liczba pozycji: ' + document.products.length, 20, finalY + 7);
                        doc.text('Laczna liczba sztuk: ' + document.products.reduce((sum, p) => sum + p.quantity, 0), 20, finalY + 14);
                    });

                    const filename = 'ELMAR_Dokumenty_' + new Date().toISOString().split('T')[0] + '.pdf';

                    // Konwersja do Blob
                    const pdfBlob = doc.output('blob');

                    // Przygotowanie FormData
                    const formData = new FormData();
                    formData.append('file', pdfBlob, filename);
                    formData.append('worker', selectedDocs[0].worker);
                    formData.append('date', selectedDocs[0].date);
                    formData.append('totalDocuments', selectedDocs.length);

                    // Wysyłka do serwera
                    const response = await fetch('send_pdf.php', {
                        method: 'POST',
                        body: formData
                    });

                    const result = await response.json();

                    if (result.success) {
                        this.showNotification('Plik PDF został wysłany do biura!', 'success');
                    } else {
                        throw new Error(result.message || 'Błąd podczas wysyłania');
                    }

                } catch (error) {
                    console.error('Błąd podczas wysyłania PDF:', error);
                    console.error('Stack trace:', error.stack);
                    alert('Wystąpił błąd podczas wysyłania pliku PDF: ' + error.message);
                    this.showNotification('Błąd podczas wysyłania', 'error');
                }
            }

            endWork() {
                const hasUnsavedWork = this.currentDocument && this.currentDocument.products.length > 0;
                let confirmMessage = 'Czy na pewno chcesz zakończyć pracę?';

                if (hasUnsavedWork) {
                    confirmMessage = 'Masz niezapisany dokument! Czy na pewno chcesz zakończyć pracę? Niezapisane zmiany zostaną utracone.';
                }

                if (confirm(confirmMessage)) {
                    this.endSession();
                    this.showScreen('endWorkScreen');
                }
            }

            endSession() {
                // Kończy sesję, ale zachowuje zapisane dokumenty
                this.currentDocument = null;
                localStorage.removeItem('elmarCurrentDocument');
                this.resetDocumentForm();
            }

            clearAllData() {
                // Czyści WSZYSTKO (funkcja pomocnicza, nie używana automatycznie)
                this.documents = [];
                this.currentDocument = null;
                localStorage.removeItem('elmarDocuments');
                localStorage.removeItem('elmarCurrentDocument');
                this.resetDocumentForm();
                this.updateDocumentsList();
            }

            resetDocumentForm() {
                document.getElementById('documentForm').reset();
                const today = new Date().toISOString().split('T')[0];
                document.getElementById('documentDate').value = today;
                this.clearManualEntryForm();
            }

            saveToStorage() {
                try {
                    localStorage.setItem('elmarDocuments', JSON.stringify(this.documents));
                    if (this.currentDocument) {
                        localStorage.setItem('elmarCurrentDocument', JSON.stringify(this.currentDocument));
                    } else {
                        localStorage.removeItem('elmarCurrentDocument');
                    }
                } catch (error) {
                    console.error('Błąd podczas zapisywania do localStorage:', error);
                }
            }

            saveCustomProductToStorage(barcode, productName) {
                try {
                    let customProducts = {};
                    const saved = localStorage.getItem('elmarCustomProducts');
                    if (saved) {
                        customProducts = JSON.parse(saved);
                    }
                    customProducts[barcode] = productName;
                    localStorage.setItem('elmarCustomProducts', JSON.stringify(customProducts));
                } catch (error) {
                    console.error('Błąd podczas zapisywania produktu:', error);
                }
            }

            loadStoredData() {
                try {
                    const storedDocs = localStorage.getItem('elmarDocuments');
                    if (storedDocs) {
                        this.documents = JSON.parse(storedDocs);
                    }

                    const storedCurrent = localStorage.getItem('elmarCurrentDocument');
                    if (storedCurrent) {
                        this.currentDocument = JSON.parse(storedCurrent);
                        this.restoreCurrentDocument();
                    }
                } catch (error) {
                    console.error('Błąd podczas ładowania danych:', error);
                    localStorage.removeItem('elmarDocuments');
                    localStorage.removeItem('elmarCurrentDocument');
                }
            }

            restoreCurrentDocument() {
                if (!this.currentDocument) return;

                document.getElementById('workerName').value = this.currentDocument.worker || '';
                document.getElementById('documentDate').value = this.currentDocument.date || '';
                document.getElementById('notes').value = this.currentDocument.notes || '';

                document.getElementById('documentWorker').textContent = this.currentDocument.worker || '';
                document.getElementById('documentDateDisplay').textContent =
                    this.currentDocument.date ? new Date(this.currentDocument.date).toLocaleDateString('pl-PL') : '';

                this.updateProductsTable();
            }

            async registerServiceWorker() {
                if ('serviceWorker' in navigator) {
                    try {
                        const registration = await navigator.serviceWorker.register(this.createServiceWorker());
                        console.log('Service Worker zarejestrowany:', registration);
                    } catch (error) {
                        console.log('Rejestracja Service Worker nieudana:', error);
                    }
                }
            }

            createServiceWorker() {
                const swCode = `
                    const CACHE_NAME = 'elmar-pwa-v2';
                    const urlsToCache = [
                        '/',
                        '/index.html'
                    ];

                    self.addEventListener('install', (event) => {
                        event.waitUntil(
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    console.log('Cache otwarty');
                                    return cache.addAll(urlsToCache);
                                })
                        );
                    });

                    self.addEventListener('fetch', (event) => {
                        event.respondWith(
                            caches.match(event.request)
                                .then((response) => {
                                    if (response) {
                                        return response;
                                    }
                                    return fetch(event.request);
                                })
                        );
                    });
                `;

                const blob = new Blob([swCode], { type: 'application/javascript' });
                return URL.createObjectURL(blob);
            }

            // Utility Functions
            escapeHtml(text) {
                const map = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#039;'
                };
                return text.replace(/[&<>"']/g, (m) => map[m]);
            }

            sanitizeForExcel(value) {
                if (typeof value !== 'string') return value;
                if (/^[=+\-@\t\r]/.test(value)) {
                    return "'" + value;
                }
                return value;
            }

            isMobile() {
                return window.innerWidth <= 768;
            }

            // Loading States
            showLoader(message = 'Ładowanie...') {
                const loader = document.createElement('div');
                loader.id = 'globalLoader';
                loader.className = 'loading-overlay';
                loader.innerHTML = `
                    <div class="loading-content">
                        <div class="loading-spinner loading-spinner--lg"></div>
                        <p>${message}</p>
                    </div>
                `;
                document.body.appendChild(loader);
                return loader;
            }

            hideLoader() {
                const loader = document.getElementById('globalLoader');
                if (loader) {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.remove(), 300);
                }
            }

            showSkeletonTable(rowCount = 5) {
                const tbody = document.getElementById('productsTableBody');
                if (!tbody) return;

                let skeletonHTML = '';
                for (let i = 0; i < rowCount; i++) {
                    skeletonHTML += `
                        <tr class="skeleton-row">
                            <td><div class="skeleton skeleton-cell skeleton-cell--sm"></div></td>
                            <td><div class="skeleton skeleton-cell skeleton-cell--lg"></div></td>
                            <td><div class="skeleton skeleton-cell skeleton-cell--md"></div></td>
                            <td><div class="skeleton skeleton-cell skeleton-cell--sm"></div></td>
                            <td><div class="skeleton skeleton-cell skeleton-cell--md"></div></td>
                            <td><div class="skeleton skeleton-cell skeleton-cell--sm"></div></td>
                        </tr>
                    `;
                }
                tbody.innerHTML = skeletonHTML;
            }

            showNotification(message, type = 'info') {
                const icons = {
                    success: '',
                    error: '',
                    warning: '',
                    info: ''
                };

                const colors = {
                    success: '#10B981',
                    error: '#EF4444',
                    warning: '#F59E0B',
                    info: '#3B82F6'
                };

                const notification = document.createElement('div');
                notification.className = `notification notification--${type}`;
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 16px 24px;
                    background: white;
                    color: #1F2937;
                    border-radius: 12px;
                    border-left: 4px solid ${colors[type]};
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                    z-index: 9999;
                    opacity: 0;
                    transform: translateX(400px) scale(0.8);
                    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                    max-width: 320px;
                    word-wrap: break-word;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 500;
                    backdrop-filter: blur(10px);
                `;

                const icon = document.createElement('span');
                icon.style.cssText = `
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: ${colors[type]};
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 16px;
                    flex-shrink: 0;
                `;
                icon.textContent = icons[type];

                const text = document.createElement('span');
                text.textContent = message;
                text.style.flex = '1';

                notification.appendChild(icon);
                notification.appendChild(text);
                document.body.appendChild(notification);

                // Slide in animation
                setTimeout(() => {
                    notification.style.opacity = '1';
                    notification.style.transform = 'translateX(0) scale(1)';
                }, 10);

                // Slide out animation - PRZYSPIESZONE
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateX(400px) scale(0.8)';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 200);
                }, 2000);
            }

            initializeResponsiveFeatures() {
                window.addEventListener('resize', () => {
                    if (this.scannerActive) {
                        this.stopScanner();
                        setTimeout(() => this.initializeScanner(), 250);
                    }
                });

                window.addEventListener('orientationchange', () => {
                    setTimeout(() => {
                        if (this.scannerActive) {
                            this.stopScanner();
                            setTimeout(() => this.initializeScanner(), 500);
                        }
                    }, 250);
                });

                this.addTouchInteractions();
            }

            addTouchInteractions() {
                let startX = null;
                let startY = null;

                document.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                });

                document.addEventListener('touchend', (e) => {
                    if (!startX || !startY) return;

                    const endX = e.changedTouches[0].clientX;
                    const endY = e.changedTouches[0].clientY;
                    const diffX = startX - endX;
                    const diffY = startY - endY;

                    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                        // Handle swipe navigation if needed
                    }

                    startX = null;
                    startY = null;
                });
            }

            // Toggle showing all documents
            toggleAllDocuments() {
                this.showAllDocuments = !this.showAllDocuments;

                // Update subtitle
                const subtitle = document.getElementById('documentsListSubtitle');
                if (subtitle) {
                    subtitle.textContent = this.showAllDocuments ? 'Wszystkie dokumenty' : 'Dzisiejsze dokumenty';
                }

                // Update button text without emoji
                const toggleBtn = document.getElementById('toggleAllDocsBtn');
                if (toggleBtn) {
                    if (this.showAllDocuments) {
                        toggleBtn.textContent = 'Pokaż tylko dzisiejsze';
                    } else {
                        if (this.documents.length > 0) {
                            toggleBtn.textContent = `Pokaż wszystkie dokumenty (${this.documents.length})`;
                        } else {
                            toggleBtn.textContent = 'Pokaż wszystkie dokumenty';
                        }
                    }
                }

                this.updateDocumentsList();
            }

            toggleSummarySection() {
                const summarySection = document.getElementById('summarySection');
                const toggleBtn = document.getElementById('toggleSummaryBtn');

                if (summarySection.style.display === 'none') {
                    summarySection.style.display = 'block';
                    toggleBtn.textContent = 'ZWIŃ PODSUMOWANIE ▲';
                    // Smooth scroll to summary
                    setTimeout(() => {
                        summarySection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                } else {
                    summarySection.style.display = 'none';
                    toggleBtn.textContent = 'PODSUMOWANIE';
                }
            }

            // Bulk Delete Functions
            bulkDelete() {
                if (this.documents.length === 0) {
                    this.showNotification('Brak dokumentów do usunięcia', 'error');
                    return;
                }

                // Create modal with choice
                const modalHtml = `
                    <div style="background: white; padding: var(--space-xl); border-radius: var(--radius-lg); max-width: 500px; text-align: center;">
                        <h3 style="color: var(--elmar-primary); margin-bottom: var(--space-lg);">Usuwanie dokumentów</h3>
                        <p style="margin-bottom: var(--space-xl); color: var(--text-secondary);">
                            Wybierz opcję usuwania:
                        </p>
                        <div style="display: flex; flex-direction: column; gap: var(--space-md);">
                            <button class="btn btn--primary" onclick="app.deleteAllDocuments(); app.closeDynamicModal(this);" style="width: 100%;">
                                Usuń wszystkie dokumenty (${this.documents.length})
                            </button>
                            <button class="btn btn--secondary" onclick="app.closeDynamicModal(this); app.showDeleteSelectionModal();" style="width: 100%;">
                                Wybierz dokumenty do usunięcia
                            </button>
                            <button class="btn btn--outline" onclick="app.closeDynamicModal(this);" style="width: 100%;">
                                Anuluj
                            </button>
                        </div>
                    </div>
                `;

                this.showDynamicModal(modalHtml);
            }

            deleteAllDocuments() {
                const confirmMessage = `UWAGA!

Czy na pewno chcesz usunąć WSZYSTKIE dokumenty (${this.documents.length})?

Ta operacja jest NIEODWRACALNA!
Wszystkie dane zostaną trwale utracone.

Czy jesteś absolutnie pewien?`;

                if (confirm(confirmMessage)) {
                    // Double confirmation for safety
                    if (confirm('Ostatnie potwierdzenie - usunąć wszystkie dokumenty?')) {
                        this.documents = [];
                        localStorage.setItem('elmarDocuments', JSON.stringify(this.documents));
                        this.updateDocumentsList();
                        this.showNotification('Wszystkie dokumenty zostały usunięte', 'success');
                    }
                }
            }

            showDeleteSelectionModal() {
                if (this.documents.length === 0) {
                    this.showNotification('Brak dokumentów do usunięcia', 'error');
                    return;
                }

                // Sort documents for display
                const sortedDocs = [...this.documents].sort((a, b) => {
                    const dateCompare = new Date(b.date) - new Date(a.date);
                    if (dateCompare !== 0) return dateCompare;
                    return b.id - a.id;
                });

                const modalHtml = `
                    <div style="background: white; padding: var(--space-xl); border-radius: var(--radius-lg); max-width: 700px; max-height: 80vh; overflow-y: auto;">
                        <h3 style="color: var(--elmar-primary); margin-bottom: var(--space-md);">Wybierz dokumenty do usunięcia</h3>
                        <p style="margin-bottom: var(--space-lg); color: var(--text-secondary); font-size: 0.9rem;">
                            Zaznacz dokumenty, które chcesz usunąć:
                        </p>

                        <div style="margin-bottom: var(--space-lg);">
                            <label style="display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-sm); background: var(--elmar-background); border-radius: var(--radius-sm); cursor: pointer;">
                                <input type="checkbox" id="selectAllDeleteCheckbox" onchange="app.toggleAllDeleteCheckboxes(this.checked)" style="width: 20px; height: 20px; cursor: pointer;">
                                <strong>Zaznacz wszystkie</strong>
                            </label>
                        </div>

                        <div id="deleteDocumentsList" style="margin-bottom: var(--space-lg); max-height: 400px; overflow-y: auto;">
                            ${sortedDocs.map(doc => {
                                const totalItems = doc.products.length;
                                const totalQuantity = doc.products.reduce((sum, p) => sum + p.quantity, 0);
                                return `
                                    <label style="display: flex; align-items: flex-start; gap: var(--space-md); padding: var(--space-md); border: 2px solid var(--elmar-border); border-radius: var(--radius-md); margin-bottom: var(--space-sm); cursor: pointer; transition: all 0.2s;"
                                           onmouseover="this.style.borderColor='var(--elmar-primary)'; this.style.background='var(--elmar-background)';"
                                           onmouseout="this.style.borderColor='var(--elmar-border)'; this.style.background='white';">
                                        <input type="checkbox" class="delete-doc-checkbox" value="${doc.id}" style="width: 20px; height: 20px; cursor: pointer; flex-shrink: 0; margin-top: 2px;">
                                        <div style="flex: 1;">
                                            <div style="font-weight: 600; color: var(--elmar-primary); margin-bottom: 4px;">
                                                Dokument #${doc.id}
                                            </div>
                                            <div style="font-size: 0.85rem; color: var(--text-secondary);">
                                                ${new Date(doc.date).toLocaleDateString('pl-PL')} |
                                                ${this.escapeHtml(doc.worker)} |
                                                ${totalItems} poz. (${totalQuantity} szt.)
                                            </div>
                                            ${doc.notes ? `<div style="font-size: 0.8rem; color: #999; margin-top: 4px;">${this.escapeHtml(doc.notes)}</div>` : ''}
                                        </div>
                                    </label>
                                `;
                            }).join('')}
                        </div>

                        <div style="border-top: 2px solid var(--elmar-border); padding-top: var(--space-lg); display: flex; gap: var(--space-md); flex-wrap: wrap;">
                            <button class="btn btn--primary" onclick="app.deleteSelectedDocuments()" style="flex: 1; min-width: 200px;">
                                Usuń zaznaczone
                            </button>
                            <button class="btn btn--outline" onclick="app.closeDynamicModal(this)" style="flex: 1; min-width: 150px;">
                                Anuluj
                            </button>
                        </div>
                    </div>
                `;

                this.showDynamicModal(modalHtml);
            }

            toggleAllDeleteCheckboxes(checked) {
                const checkboxes = document.querySelectorAll('.delete-doc-checkbox');
                checkboxes.forEach(cb => cb.checked = checked);
            }

            deleteSelectedDocuments() {
                const checkboxes = document.querySelectorAll('.delete-doc-checkbox:checked');

                if (checkboxes.length === 0) {
                    this.showNotification('Nie zaznaczono żadnych dokumentów', 'error');
                    return;
                }

                const selectedIds = Array.from(checkboxes).map(cb => Number(cb.value));

                const confirmMessage = `UWAGA!

Czy na pewno chcesz usunąć ${selectedIds.length} zaznaczonych dokumentów?

Ta operacja jest NIEODWRACALNA!
Wybrane dokumenty zostaną trwale utracone.

Czy jesteś pewien?`;

                if (confirm(confirmMessage)) {
                    // Filter out selected documents
                    this.documents = this.documents.filter(doc => !selectedIds.includes(doc.id));
                    localStorage.setItem('elmarDocuments', JSON.stringify(this.documents));

                    // Close modal and restore scroll
                    const modal = document.querySelector('.modal-backdrop');
                    if (modal) modal.remove();
                    document.body.style.overflow = '';

                    this.updateDocumentsList();
                    this.showNotification(`Usunięto ${selectedIds.length} dokumentów`, 'success');
                }
            }

            // Helper function to close dynamic modal and restore scroll
            closeDynamicModal(element) {
                const modal = element ? element.closest('.modal-backdrop') : document.querySelector('.modal-backdrop');
                if (modal) modal.remove();
                document.body.style.overflow = '';
            }

            showDynamicModal(htmlContent) {
                // Remove any existing dynamic modals first
                const existingModals = document.querySelectorAll('.modal-backdrop');
                existingModals.forEach(m => {
                    m.remove();
                });

                // Scroll viewport to top so user sees the modal (which appears at top on mobile)
                window.scrollTo({ top: 0, behavior: 'instant' });
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;

                const modal = document.createElement('div');
                modal.className = 'modal-backdrop';

                // Check if mobile device (width or height constrained)
                const isMobile = window.innerWidth <= 768 || window.innerHeight <= 600;

                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    align-items: ${isMobile ? 'flex-start' : 'center'};
                    justify-content: center;
                    z-index: 10001;
                    padding: var(--space-md);
                    padding-top: ${isMobile ? 'calc(env(safe-area-inset-top, 10px) + var(--space-lg))' : 'var(--space-md)'};
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                `;

                // Wrap content in a container with proper styling
                const contentWrapper = document.createElement('div');
                contentWrapper.style.cssText = `
                    max-height: ${isMobile ? '90vh' : '85vh'};
                    overflow-y: auto;
                    margin: ${isMobile ? '0' : 'auto'};
                `;
                contentWrapper.innerHTML = htmlContent;
                modal.appendChild(contentWrapper);

                // Close on backdrop click (not on content click)
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.remove();
                        document.body.style.overflow = '';
                    }
                });

                // Prevent body scroll when modal is open
                document.body.style.overflow = 'hidden';

                document.body.appendChild(modal);

                // Ensure modal content is scrolled to top
                contentWrapper.scrollTop = 0;
            }

            // Export/Import Functions
            exportToJSON() {
                try {
                    const exportData = {
                        documents: this.documents,
                        customProducts: JSON.parse(localStorage.getItem('elmarCustomProducts') || '{}'),
                        exportDate: new Date().toISOString(),
                        version: '1.0'
                    };

                    const dataStr = JSON.stringify(exportData, null, 2);
                    const blob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `elmar-backup-${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    this.showNotification('Dane zostały wyeksportowane', 'success');
                } catch (error) {
                    console.error('Export error:', error);
                    this.showNotification('Błąd podczas exportu danych', 'error');
                }
            }

            importFromJSON() {
                const input = document.getElementById('jsonImportInput');
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            const importData = JSON.parse(event.target.result);

                            if (!importData.documents || !Array.isArray(importData.documents)) {
                                throw new Error('Nieprawidłowy format danych');
                            }

                            // Confirm before import
                            if (confirm(`Czy na pewno chcesz zaimportować dane?\n\nDokumenty do importu: ${importData.documents.length}\nData eksportu: ${new Date(importData.exportDate).toLocaleString('pl-PL')}\n\nUWAGA: To nadpisze istniejące dane!`)) {
                                this.documents = importData.documents;
                                localStorage.setItem('elmarDocuments', JSON.stringify(this.documents));

                                if (importData.customProducts) {
                                    localStorage.setItem('elmarCustomProducts', JSON.stringify(importData.customProducts));
                                }

                                this.updateDocumentsList();
                                this.showNotification('Dane zostały zaimportowane', 'success');
                            }
                        } catch (error) {
                            console.error('Import error:', error);
                            this.showNotification('Błąd podczas importu: ' + error.message, 'error');
                        }
                    };
                    reader.readAsText(file);

                    // Reset input
                    input.value = '';
                };
                input.click();
            }

            // Summary Generation
            generateSummary() {
                const dateFrom = document.getElementById('summaryDateFrom').value;
                const dateTo = document.getElementById('summaryDateTo').value;
                const resultsContainer = document.getElementById('summaryResults');

                if (!dateFrom || !dateTo) {
                    this.showNotification('Proszę wybrać zakres dat', 'error');
                    return;
                }

                if (new Date(dateFrom) > new Date(dateTo)) {
                    this.showNotification('Data początkowa nie może być późniejsza niż data końcowa', 'error');
                    return;
                }

                // Filter documents by date range
                const filteredDocs = this.documents.filter(doc => {
                    const docDate = new Date(doc.date);
                    const from = new Date(dateFrom);
                    const to = new Date(dateTo);
                    return docDate >= from && docDate <= to;
                });

                if (filteredDocs.length === 0) {
                    resultsContainer.innerHTML = `
                        <div class="empty-state" style="text-align: center; padding: var(--space-lg); background: var(--elmar-background); border-radius: 8px;">
                            Brak dokumentów w wybranym okresie
                        </div>
                    `;
                    return;
                }

                // Sort by date
                const sortedDocs = [...filteredDocs].sort((a, b) => new Date(a.date) - new Date(b.date));

                // Calculate totals
                let totalDocuments = sortedDocs.length;
                let totalPositions = 0;
                let totalQuantity = 0;

                sortedDocs.forEach(doc => {
                    totalPositions += doc.products.length;
                    totalQuantity += doc.products.reduce((sum, p) => sum + p.quantity, 0);
                });

                // Generate summary table
                resultsContainer.innerHTML = `
                    <div style="background: white; padding: var(--space-lg); border-radius: 8px; box-shadow: var(--shadow-md);">
                        <h4 style="color: var(--elmar-primary); margin-bottom: var(--space-md);">
                            Zestawienie za okres ${new Date(dateFrom).toLocaleDateString('pl-PL')} - ${new Date(dateTo).toLocaleDateString('pl-PL')}
                        </h4>

                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; margin-bottom: var(--space-lg);">
                                <thead>
                                    <tr style="background: var(--elmar-primary); color: white;">
                                        <th style="padding: 12px 8px; text-align: left;">LP</th>
                                        <th style="padding: 12px 8px; text-align: left;">Data</th>
                                        <th style="padding: 12px 8px; text-align: left;">Magazynier</th>
                                        <th style="padding: 12px 8px; text-align: center;">Pozycji</th>
                                        <th style="padding: 12px 8px; text-align: center;">Sztuk</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${sortedDocs.map((doc, index) => {
                                        const docPositions = doc.products.length;
                                        const docQuantity = doc.products.reduce((sum, p) => sum + p.quantity, 0);
                                        return `
                                            <tr style="border-bottom: 1px solid #e5e7eb;">
                                                <td style="padding: 10px 8px;">${index + 1}</td>
                                                <td style="padding: 10px 8px;">${new Date(doc.date).toLocaleDateString('pl-PL')}</td>
                                                <td style="padding: 10px 8px;">${this.escapeHtml(doc.worker)}</td>
                                                <td style="padding: 10px 8px; text-align: center; font-weight: 500;">${docPositions}</td>
                                                <td style="padding: 10px 8px; text-align: center; font-weight: 500;">${docQuantity}</td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                                <tfoot>
                                    <tr style="background: var(--elmar-background); font-weight: bold; font-size: 1rem;">
                                        <td colspan="3" style="padding: 12px 8px;">RAZEM:</td>
                                        <td style="padding: 12px 8px; text-align: center; color: var(--elmar-primary);">${totalPositions}</td>
                                        <td style="padding: 12px 8px; text-align: center; color: var(--elmar-primary);">${totalQuantity}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div style="background: var(--elmar-background); padding: var(--space-md); border-radius: 8px; border-left: 4px solid var(--elmar-primary);">
                            <h5 style="margin: 0 0 var(--space-sm) 0; color: var(--elmar-primary);">Podsumowanie</h5>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-md);">
                                <div>
                                    <div style="font-size: 0.85rem; color: var(--text-secondary);">Liczba dokumentów</div>
                                    <div style="font-size: 1.5rem; font-weight: bold; color: var(--elmar-primary);">${totalDocuments}</div>
                                </div>
                                <div>
                                    <div style="font-size: 0.85rem; color: var(--text-secondary);">Łączna liczba pozycji</div>
                                    <div style="font-size: 1.5rem; font-weight: bold; color: var(--elmar-primary);">${totalPositions}</div>
                                </div>
                                <div>
                                    <div style="font-size: 0.85rem; color: var(--text-secondary);">Łączna liczba sztuk</div>
                                    <div style="font-size: 1.5rem; font-weight: bold; color: var(--elmar-primary);">${totalQuantity}</div>
                                </div>
                            </div>
                        </div>

                        <div style="margin-top: var(--space-lg); display: flex; gap: var(--space-sm);">
                            <button class="btn btn--primary" onclick="app.exportSummaryToExcel('${dateFrom}', '${dateTo}')">Eksport do Excel</button>
                            <button class="btn btn--outline" onclick="document.getElementById('summaryResults').innerHTML = ''">Zamknij</button>
                        </div>
                    </div>
                `;

                this.showNotification('Wygenerowano podsumowanie', 'success');
            }

            exportSummaryToExcel(dateFrom, dateTo) {
                // Filter and sort documents
                const filteredDocs = this.documents.filter(doc => {
                    const docDate = new Date(doc.date);
                    const from = new Date(dateFrom);
                    const to = new Date(dateTo);
                    return docDate >= from && docDate <= to;
                }).sort((a, b) => new Date(a.date) - new Date(b.date));

                if (filteredDocs.length === 0) {
                    this.showNotification('Brak danych do eksportu', 'error');
                    return;
                }

                // Calculate totals
                let totalPositions = 0;
                let totalQuantity = 0;
                filteredDocs.forEach(doc => {
                    totalPositions += doc.products.length;
                    totalQuantity += doc.products.reduce((sum, p) => sum + p.quantity, 0);
                });

                // Prepare data for Excel
                const data = [];

                // Title row
                data.push(['ZESTAWIENIE DOKUMENTÓW WYDANIA']);
                data.push([`Okres: ${new Date(dateFrom).toLocaleDateString('pl-PL')} - ${new Date(dateTo).toLocaleDateString('pl-PL')}`]);
                data.push([`Wygenerowano: ${new Date().toLocaleString('pl-PL')}`]);
                data.push([]); // Empty row

                // Header row
                data.push(['LP', 'Data', 'Magazynier', 'Liczba pozycji', 'Liczba sztuk']);

                // Data rows
                filteredDocs.forEach((doc, index) => {
                    const docPositions = doc.products.length;
                    const docQuantity = doc.products.reduce((sum, p) => sum + p.quantity, 0);

                    data.push([
                        index + 1,
                        new Date(doc.date).toLocaleDateString('pl-PL'),
                        this.sanitizeForExcel(doc.worker),
                        docPositions,
                        docQuantity
                    ]);
                });

                // Summary row
                data.push([]); // Empty row
                data.push(['RAZEM:', '', '', totalPositions, totalQuantity]);
                data.push([]); // Empty row
                data.push(['Liczba dokumentów:', filteredDocs.length]);
                data.push(['Łączna liczba pozycji:', totalPositions]);
                data.push(['Łączna liczba sztuk:', totalQuantity]);

                // Create workbook and worksheet
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.aoa_to_sheet(data);

                // Set column widths
                ws['!cols'] = [
                    { wch: 5 },  // LP
                    { wch: 15 }, // Data
                    { wch: 30 }, // Magazynier
                    { wch: 15 }, // Liczba pozycji
                    { wch: 15 }  // Liczba sztuk
                ];

                // Add worksheet to workbook
                XLSX.utils.book_append_sheet(wb, ws, 'Zestawienie');

                // Generate file
                XLSX.writeFile(wb, `zestawienie-${dateFrom}_${dateTo}.xlsx`);
                this.showNotification('Excel został wygenerowany', 'success');
            }
        }

        // Initialize app when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            window.app = new ElmarApp();
        });

        // Handle app installation prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            // Show the install button on start screen
            const installPwaBtn = document.getElementById('installPwaBtn');
            if (installPwaBtn) {
                installPwaBtn.style.display = 'flex';
                installPwaBtn.addEventListener('click', () => {
                    installApp();
                });
            }

            const installBanner = document.createElement('div');
            installBanner.innerHTML = `
                <div style="
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    right: 20px;
                    background: var(--elmar-primary);
                    color: white;
                    padding: 16px;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    z-index: 9999;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                " id="install-banner">
                    <span>Zainstaluj aplikację ELMAR PWA na swoim urządzeniu</span>
                    <button class="btn btn--secondary btn--sm" onclick="installApp()">Zainstaluj</button>
                    <button style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;" onclick="dismissInstallBanner()">×</button>
                </div>
            `;
            document.body.appendChild(installBanner);
        });

        // Install app function
        function installApp() {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('Użytkownik zainstalował aplikację');
                    }
                    deferredPrompt = null;
                    dismissInstallBanner();
                    // Hide the install button after installation
                    const installPwaBtn = document.getElementById('installPwaBtn');
                    if (installPwaBtn) {
                        installPwaBtn.style.display = 'none';
                    }
                });
            }
        }

        // Dismiss install banner
        function dismissInstallBanner() {
            const banner = document.getElementById('install-banner');
            if (banner) {
                banner.remove();
            }
        }

        // Handle app updates
        window.addEventListener('appinstalled', () => {
            console.log('Aplikacja została zainstalowana');
            dismissInstallBanner();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (window.app && window.app.currentDocument && window.app.currentDocument.products.length > 0) {
                    window.app.finishAndSaveDocument();
                }
            }

            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    activeModal.classList.remove('active');
                }
            }
        });

        // Prevent zoom on double tap for better mobile experience
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        let lastTouchEnd = 0;

        // Handle online/offline status
        window.addEventListener('online', () => {
            console.log('Aplikacja jest online');
            document.body.classList.remove('offline');
        });

        window.addEventListener('offline', () => {
            console.log('Aplikacja jest offline');
            document.body.classList.add('offline');
        });
    </script>
</body>
