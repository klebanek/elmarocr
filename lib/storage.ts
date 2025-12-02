// Storage layer using localStorage for GitHub Pages deployment
// Replaces API with browser storage

export type Product = {
  id: string;
  barcode: string;
  name: string;
  isManual: boolean;
  createdAt: string;
};

export type DocumentItem = {
  id: string;
  productId: string;
  quantity: number;
  createdAt: string;
};

export type Document = {
  id: string;
  warehouseWorker: string;
  date: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: DocumentItem[];
};

// Storage keys
const PRODUCTS_KEY = 'elmar_products';
const DOCUMENTS_KEY = 'elmar_documents';

// Helper to generate unique IDs
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Initialize with default products if empty
const initializeDefaultProducts = () => {
  const products = getProducts();
  if (products.length === 0) {
    const defaultProductsData: { [key: string]: string } = {
      "5903240542451": "Filety śledziowe marynowane z żurawiną 2 kg taca",
      "5903240542345": "Żębacz filet wędzony 2kg",
      "5907632658232": "Zawijaniec z łososia ze śliwką 2kg",
      "5903240542444": "wolny3 2kg",
      "5903240542048": "wolny2 450g",
      "5903240542529": "wolny 450g",
      "5903240542949": "wolny 200g",
      "5903240542499": "wolny 1kg",
      "5903240542369": "Tuszki śledziowe wędzone 3kg",
      "5903240542376": "Tuszka śledziowa wędzona 3kg",
      "5907632658140": "Tuszka śledziowa marynowana Moskaliki 3.3kg",
      "5907632658560": "Trewal wędzony 2kg",
      "5907632658089": "Śledź b/g lekko solony dalekomorski 300+ 5.8kg",
      "5907632658072": "Śledź b/g lekko solony dalekomorski 300+ 3.5kg",
      "5903240542079": "Śledź b/g lekko solony dalekomorski 300+ 12kg",
      "5903240542086": "Śledź b/g lekko solony dalekomorski 300+ 1.2kg",
      "5903240542390": "Śledzik z grzybkami 450g",
      "5903240542468": "Śledzik z grzybkami 2kg",
      "5903240542482": "Śledzik z grzybkami 1kg",
      "5903240542659": "Szprot wędzony VAC tacka 200g",
      "5903240542338": "Szprot wędzony 3kg",
      "5903240542178": "Szprot wędzony 2kg",
      "5903240542208": "Szaszłyki z łososia wędzone 2kg",
      "5903240542710": "Szaszłyk z łososia ze śliwką krótki 2kg",
      "5903240542222": "Szaszłyk z łososia z ananasem KRÓTKI 2kg",
      "5907632658102": "Sielawa wędzona 2kg",
      "5903240542970": "Sardynka wędzona 2kg",
      "5903240542291": "Ryba z pieca (makrela) 2kg",
      "5903240542017": "Ryba po grecku 500g",
      "5907632658775": "Ryba po grecku 3kg",
      "5903240542024": "Ryba po grecku 2kg",
      "5903240542253": "Pstrąg wędzony 2kg",
      "5907632658058": "Płaty śledziowe solone ze skórą 3.5kg",
      "5907632658133": "Płaty śledziowe marynowane 5.8kg",
      "5907632658126": "Płaty śledziowe marynowane 3.3kg",
      "5907632658553": "Płat z makreli z warzywami 2kg",
      "5903240542352": "Płat śledziowy wędzony 2kg",
      "5903240542420": "Plamiak tusza wędzony 3kg",
      "5903240542260": "Pikling wędzony 3kg",
      "5903240542512": "Pasta z makreli 2kg",
      "5903240542628": "Paski z łososia 5+ 3kg",
      "5903240542611": "Paski z łososia 3+ 3kg",
      "5907632658799": "Ostrobok wędzony 2kg",
      "5903240542932": "Morszczuk wędzony 3kg",
      "5903240542130": "Morszczuk wędzony 2kg",
      "5903240542574": "MINI KOSTKA Z ŁOSOSIA WĘDZONA NA ZIMNO 2kg",
      "5903240542802": "Matias filety śledziowe bez skóry PREMIUM 700g",
      "5907632658041": "Matias filety śledziowe bez skóry PREMIUM 5kg",
      "5907632658751": "Matias filety śledziowe bez skóry PREMIUM 5.8kg",
      "5907632658034": "Matias filety śledziowe bez skóry PREMIUM 3.5kg",
      "5907632658027": "Matias filety śledziowe bez skóry PREMIUM 3.3kg",
      "5903240542758": "Matias filety śledziowe bez skóry PREMIUM 15kg",
      "5907632658768": "Matias filety śledziowe bez skóry PREMIUM 12kg",
      "5907632658010": "Matias filety śledziowe bez skóry PREMIUM 1.2kg",
      "5903240542314": "Makrela wędzona na zimno 4kg",
      "5903240542383": "Makrela wędzona B/D 4kg",
      "5903240542123": "Makrela wędzona 4kg",
      "5903240542116": "Makrela wędzona 3kg",
      "5903240542109": "Makrela wędzona 2kg",
      "5903240542154": "Makrela pieczona 2kg",
      "5903240542895": "Łosoś z przyprawami porcje premium 2kg",
      "5903240542604": "Łosoś sałatkowy wędzony na gorąco VAC 500g",
      "5903240542635": "Łosoś paski wędzony 2+ 3kg",
      "5903240542925": "Łosoś ogonki z fileta wędzony 2kg",
      "5903240542840": "ŁOSOŚ FILET WĘDZONY PREMIUM 2kg",
      "5903240542598": "Kręgosłupy z łososia 2kg",
      "5903240542321": "Kotlety rybne smażone 2kg",
      "5907632658256": "Koreczki śledziowe po \"Kaszubsku\" 800g",
      "5903240542062": "Koreczki śledziowe po \"Kaszubsku\" 450g",
      "5907632658270": "Koreczki śledziowe po \"Kaszubsku\" 3kg",
      "5907632658263": "Koreczki śledziowe po \"Kaszubsku\" 1000g",
      "5907632658454": "Koreczki śledziowe \"Po szlachecku\" 3,2kg",
      "5903240542277": "Kiełbaski z łososia 2kg",
      "5903240542703": "Karmazyn wędzony 2kg",
      "5903240542215": "Halibut wędzony 2kg",
      "5903240542567": "Filety śledziowe z żurawiną 450g",
      "5903240542536": "Filety śledziowe z żurawiną 2kg",
      "5903240542475": "Filety śledziowe z żurawiną 1kg",
      "5903240542789": "Filety śledziowe w sosie śmietanowym 300g",
      "5903240542987": "Filety śledziowe w sosie śmietanowym 2kg",
      "5903240542772": "Filety śledziowe solone KORZENNE 450g",
      "5903240542741": "Filety śledziowe solone KORZENNE 2kg",
      "5903240542055": "Filety śledziowe marynowane \"Tomatillo\" 450g",
      "5907632658485": "Filety śledziowe marynowane \"Tomatillo\" 3,3kg",
      "5903240542437": "Filety śledziowe marynowane \"Tomatillo\" 2kg",
      "5903240542505": "Filety śledziowe marynowane \"Tomatillo\" 1kg",
      "5907632658324": "Filety śledziowe BRYZA 3.3kg",
      "5907632658164": "Filety śledziowe \"Wiejskie\" 800g",
      "5907632658782": "Filety śledziowe \"Wiejskie\" 5.5kg",
      "5903240542031": "Filety śledziowe \"Wiejskie\" 450g",
      "5907632658188": "Filety śledziowe \"Wiejskie\" 3.3kg",
      "5907632658195": "Filety śledziowe \"Wiejskie\" 3,5kg",
      "5907632658171": "Filety śledziowe \"Wiejskie\" 1kg",
      "5907632658515": "Filety śledziowe \"Sułtańskie\" 450g",
      "5907632658508": "Filety śledziowe \"Sułtańskie\" 3kg",
      "5903240542093": "Filety śledziowe \"Salsa\" 500g",
      "5907632658539": "Filety śledziowe \"Salsa\" 3kg",
      "5903240542543": "Filety śledziowe \"Pieguski\" 450g",
      "5907632658614": "Filety śledziowe \"Pieguski\" 3kg",
      "5903240542550": "Filety śledziowe \"Domowe\" 450g",
      "5907632658713": "Filety śledziowe \"Domowe\" 3,3kg",
      "5907632658683": "Filety śledziowe \"A'la łosoś\" 3.3kg",
      "5903240542406": "Filety rybne zapiekane z serem 2kg",
      "5903240542185": "Filet z Żębacza wędzony 2kg",
      "5903240542871": "Filet z miruny z/s w cieście 2kg",
      "5903240542642": "FILET Z MIRUNY NOWOZELANDZKIEJ ZE SKÓRĄ 3kg",
      "5903240542239": "FILET Z MIRUNY NOWOZELANDZKIEJ ZE SKÓRĄ 2kg",
      "5903240542994": "FILET Z MIRUNY NOWOZELANDZKIEJ ZE SKÓRĄ 1kg",
      "5903240542192": "Filet z łososia wędzony 2kg",
      "5903240542833": "Filet śledziowy opiekany w cieście 2kg",
      "5903240542307": "Faworki wędzone 2kg",
      "5903240542147": "Dorsz wędzony 3kg",
      "5903240542765": "Dorsz czarny filet mrożony 3kg",
      "5903240542734": "Dorsz czarny filet mrożony 2kg",
      "5903240542000": "Dorsz czarny filet mrożony 1kg",
      "5907632658096": "Dorada wędzona 2kg",
      "5903240542284": "Brzuszki z łososia wędzone 3kg"
    };

    const defaultProducts: Product[] = Object.entries(defaultProductsData).map(([barcode, name]) => ({
      id: generateId(),
      barcode,
      name,
      isManual: false,
      createdAt: new Date().toISOString(),
    }));

    saveProducts(defaultProducts);
  }
};

// Products CRUD
export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(PRODUCTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveProducts = (products: Product[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getProductByBarcode = (barcode: string): Product | null => {
  const products = getProducts();
  return products.find(p => p.barcode === barcode) || null;
};

export const getProductById = (id: string): Product | null => {
  const products = getProducts();
  return products.find(p => p.id === id) || null;
};

export const addProduct = (barcode: string, name: string, isManual = true): Product => {
  const products = getProducts();

  // Check if exists
  const existing = products.find(p => p.barcode === barcode);
  if (existing) {
    throw new Error('Product with this barcode already exists');
  }

  const newProduct: Product = {
    id: generateId(),
    barcode,
    name,
    isManual,
    createdAt: new Date().toISOString(),
  };

  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const searchProducts = (search: string): Product[] => {
  const products = getProducts();
  const lowerSearch = search.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(lowerSearch) ||
    p.barcode.includes(search)
  );
};

// Documents CRUD
export const getDocuments = (): Document[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(DOCUMENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveDocuments = (documents: Document[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
};

export const getDocumentById = (id: string): Document | null => {
  const documents = getDocuments();
  return documents.find(d => d.id === id) || null;
};

export const createDocument = (
  warehouseWorker: string,
  date: string,
  notes: string | null,
  items: { productId: string; quantity: number }[]
): Document => {
  const documents = getDocuments();

  const newDocument: Document = {
    id: generateId(),
    warehouseWorker,
    date,
    notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: items.map(item => ({
      id: generateId(),
      productId: item.productId,
      quantity: item.quantity,
      createdAt: new Date().toISOString(),
    })),
  };

  documents.push(newDocument);
  saveDocuments(documents);
  return newDocument;
};

export const updateDocument = (
  id: string,
  warehouseWorker: string,
  date: string,
  notes: string | null
): Document | null => {
  const documents = getDocuments();
  const index = documents.findIndex(d => d.id === id);

  if (index === -1) return null;

  documents[index] = {
    ...documents[index],
    warehouseWorker,
    date,
    notes,
    updatedAt: new Date().toISOString(),
  };

  saveDocuments(documents);
  return documents[index];
};

export const deleteDocument = (id: string): boolean => {
  const documents = getDocuments();
  const filtered = documents.filter(d => d.id !== id);

  if (filtered.length === documents.length) return false;

  saveDocuments(filtered);
  return true;
};

// Get document with populated product data
export const getDocumentWithProducts = (id: string) => {
  const document = getDocumentById(id);
  if (!document) return null;

  const products = getProducts();

  return {
    ...document,
    items: document.items.map(item => ({
      ...item,
      product: products.find(p => p.id === item.productId) || null,
    })),
  };
};

export const getAllDocumentsWithProducts = () => {
  const documents = getDocuments();
  const products = getProducts();

  return documents.map(document => ({
    ...document,
    items: document.items.map(item => ({
      ...item,
      product: products.find(p => p.id === item.productId) || null,
    })),
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Initialize on first load
if (typeof window !== 'undefined') {
  initializeDefaultProducts();
}
