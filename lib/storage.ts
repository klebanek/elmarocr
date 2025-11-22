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
    const defaultProducts: Product[] = [
      { id: generateId(), barcode: '5901234567890', name: 'Filet z łososia norweskiego 300g', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567891', name: 'Dorsz mrożony filet 400g', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567892', name: 'Krewetki królewskie 250g', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567893', name: 'Tuńczyk w oleju 170g', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567894', name: 'Pstrąg tęczowy świeży 1kg', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567895', name: 'Makrela wędzona 200g', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567896', name: 'Śledź marynowany 300g', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567897', name: 'Kalmary mrożone 500g', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567898', name: 'Okoń nilowy filet 350g', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567899', name: 'Mintaj mrożony 1kg', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567800', name: 'Sum europejski filet 400g', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567801', name: 'Płastuga mrożona 300g', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567802', name: 'Halibut filet 250g', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567803', name: 'Sandacz świeży 1kg', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567804', name: 'Łosoś wędzony 150g', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567805', name: 'Sardynki w oleju 120g', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567806', name: 'Szprotki wędzone 170g', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567807', name: 'Ośmiornica mrożona 600g', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567808', name: 'Małże świeże 500g', isManual: false, createdAt: new Date().toISOString() },
      { id: generateId(), barcode: '5901234567809', name: 'Tusza łososia 2kg', isManual: false, createdAt: new Date().toISOString() },
    ];
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
