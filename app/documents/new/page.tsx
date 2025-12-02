"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ProductItem = {
  productId: string;
  productName: string;
  barcode: string;
  quantity: number;
};

export default function NewDocumentPage() {
  const router = useRouter();
  const [warehouseWorker, setWarehouseWorker] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ProductItem[]>([]);
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerError, setScannerError] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductBarcode, setNewProductBarcode] = useState("");
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{id: string, name: string, barcode: string} | null>(null);
  const [quantity, setQuantity] = useState(1);
  const scannerRef = useRef<any>(null);

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // Initialize scanner when modal opens
  useEffect(() => {
    if (showScanner && typeof window !== 'undefined') {
      startScanner();
    } else if (!showScanner && scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
  }, [showScanner]);

  const startScanner = async () => {
    try {
      setScannerError("");
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode');

      const html5QrCode = new Html5Qrcode("barcode-scanner");
      scannerRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
        ],
      };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          // Sukces skanowania - dodaj kod do pola input i automatycznie przetwórz
          setBarcode(decodedText);
          setShowScanner(false);

          // Automatycznie przetwórz zeskanowany kod
          setTimeout(() => {
            handleBarcodeSubmit();
          }, 100);
        },
        () => {
          // Ignoruj błędy skanowania (normalne gdy szukamy kodu)
        }
      );
    } catch (err: any) {
      console.error("Scanner error:", err);
      setScannerError("Nie udało się uruchomić kamery. Sprawdź uprawnienia.");
    }
  };

  const handleBarcodeSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!barcode.trim()) return;

    const { getProductByBarcode } = await import('@/lib/storage');
    const product = getProductByBarcode(barcode);

    if (product) {
      // Pokaż modal z pytaniem o ilość
      setSelectedProduct({
        id: product.id,
        name: product.name,
        barcode: product.barcode
      });
      setQuantity(1);
      setShowQuantityModal(true);
      setBarcode(""); // Wyczyść pole kodu
    } else {
      // Produkt nie znaleziony - zaproponuj dodanie
      setNewProductBarcode(barcode);
      setShowAddProduct(true);
    }
  };

  const handleConfirmQuantity = () => {
    if (!selectedProduct) return;

    // Sprawdź czy produkt już jest na liście
    const existingItem = items.find((item) => item.productId === selectedProduct.id);

    if (existingItem) {
      // Zwiększ ilość istniejącego produktu
      setItems(
        items.map((item) =>
          item.productId === selectedProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      // Dodaj nowy produkt
      setItems([
        ...items,
        {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          barcode: selectedProduct.barcode,
          quantity: quantity,
        },
      ]);
    }

    // Reset
    setShowQuantityModal(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleAddNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductBarcode.trim() || !newProductName.trim()) return;

    try {
      const { addProduct } = await import('@/lib/storage');
      const newProduct = addProduct(newProductBarcode, newProductName, true);

      // Zamknij modal dodawania produktu
      setShowAddProduct(false);
      setNewProductName("");
      setNewProductBarcode("");
      setBarcode("");

      // Pokaż modal z pytaniem o ilość dla nowo dodanego produktu
      setSelectedProduct({
        id: newProduct.id,
        name: newProduct.name,
        barcode: newProduct.barcode
      });
      setQuantity(1);
      setShowQuantityModal(true);
    } catch (error: any) {
      alert(error.message || "Błąd podczas dodawania produktu");
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setItems(items.filter((item) => item.productId !== productId));
    } else {
      setItems(
        items.map((item) =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (productId: string) => {
    setItems(items.filter((item) => item.productId !== productId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!warehouseWorker.trim()) {
      alert("Podaj imię i nazwisko magazyniera");
      return;
    }

    if (items.length === 0) {
      alert("Dodaj przynajmniej jeden produkt");
      return;
    }

    setLoading(true);
    try {
      const { createDocument } = await import('@/lib/storage');
      const document = createDocument(
        warehouseWorker,
        date,
        notes || null,
        items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      );

      router.push(`/documents?id=${document.id}`);
    } catch (error) {
      console.error("Error creating document:", error);
      alert("Błąd podczas tworzenia dokumentu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-cyan-800 to-teal-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-cyan-100 hover:text-white mb-4 inline-block"
          >
            ← Powrót do menu
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Nowy Dokument WZ</h1>
          <p className="text-cyan-100">Utwórz nowy dokument wydania magazynowego</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Podstawowe informacje */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Dane dokumentu
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-medium">
                  Magazynier *
                </label>
                <input
                  type="text"
                  value={warehouseWorker}
                  onChange={(e) => setWarehouseWorker(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Imię i nazwisko"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">
                  Uwagi
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Dodatkowe informacje..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Dodawanie produktów */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Produkty
            </h2>

            {/* Formularz skanowania */}
            <div className="mb-6">
              <label className="block text-white mb-2 font-medium">
                Zeskanuj lub wpisz kod kreskowy
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleBarcodeSubmit();
                    }
                  }}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Kod kreskowy (EAN-13)"
                  maxLength={13}
                />
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  📷 Kamera
                </button>
                <button
                  type="button"
                  onClick={() => handleBarcodeSubmit()}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
                >
                  Dodaj
                </button>
              </div>
            </div>

            {/* Lista produktów */}
            {items.length > 0 ? (
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="bg-white/10 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.productName}</p>
                      <p className="text-cyan-200 text-sm">{item.barcode}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded text-white font-bold"
                        >
                          -
                        </button>
                        <span className="text-white font-medium w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded text-white font-bold"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-red-300 hover:text-red-100 font-medium"
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-cyan-200 text-center py-8">
                Brak produktów. Dodaj produkty skanując kod kreskowy.
              </p>
            )}
          </div>

          {/* Przyciski */}
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors text-center border border-white/20"
            >
              Anuluj
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Tworzenie..." : "Utwórz dokument"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal skanera */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-cyan-700 px-6 py-4 flex justify-between items-center">
              <h3 className="text-white text-xl font-bold">
                Skanuj kod kreskowy
              </h3>
              <button
                onClick={() => setShowScanner(false)}
                className="text-white hover:text-cyan-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {scannerError ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <p>{scannerError}</p>
                  <p className="text-sm mt-2">
                    Upewnij się że zezwoliłeś na dostęp do kamery w przeglądarce.
                  </p>
                </div>
              ) : (
                <>
                  <div
                    id="barcode-scanner"
                    className="w-full rounded-lg overflow-hidden bg-gray-900"
                  ></div>
                  <p className="text-gray-600 text-sm mt-4 text-center">
                    Skieruj kamerę na kod kreskowy EAN-13
                  </p>
                </>
              )}
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => setShowScanner(false)}
                className="w-full px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pytania o ilość */}
      {showQuantityModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
            <div className="bg-cyan-700 px-6 py-4">
              <h3 className="text-white text-xl font-bold">
                Podaj ilość
              </h3>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-700 font-medium mb-2">{selectedProduct.name}</p>
                <p className="text-gray-500 text-sm font-mono">{selectedProduct.barcode}</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Ilość sztuk
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-bold text-xl"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 px-4 py-3 text-center text-2xl font-bold rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    min="1"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowQuantityModal(false);
                    setSelectedProduct(null);
                    setQuantity(1);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors"
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  onClick={handleConfirmQuantity}
                  className="flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
                >
                  Dodaj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal dodawania nowego produktu */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-cyan-700 px-6 py-4 flex justify-between items-center">
              <h3 className="text-white text-xl font-bold">
                Dodaj nowy produkt
              </h3>
              <button
                onClick={() => {
                  setShowAddProduct(false);
                  setNewProductName("");
                  setNewProductBarcode("");
                }}
                className="text-white hover:text-cyan-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddNewProduct} className="p-6">
              <p className="text-gray-700 mb-4">
                Produkt o kodzie <strong>{newProductBarcode}</strong> nie został znaleziony w bazie.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Kod kreskowy
                  </label>
                  <input
                    type="text"
                    value={newProductBarcode}
                    onChange={(e) => setNewProductBarcode(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    pattern="[0-9]{8,13}"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Nazwa produktu *
                  </label>
                  <input
                    type="text"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="np. Dorsz mrożony 500g"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddProduct(false);
                    setNewProductName("");
                    setNewProductBarcode("");
                  }}
                  className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
                >
                  Dodaj i użyj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
