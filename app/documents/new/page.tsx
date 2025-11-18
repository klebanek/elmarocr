"use client";

import { useState } from "react";
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

  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) return;

    try {
      // Szukaj produktu po kodzie kreskowym
      const response = await fetch(`/api/products?barcode=${barcode}`);
      const product = await response.json();

      if (product && product.id) {
        // Sprawdź czy produkt już jest na liście
        const existingItem = items.find((item) => item.productId === product.id);

        if (existingItem) {
          // Zwiększ ilość
          setItems(
            items.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          );
        } else {
          // Dodaj nowy produkt
          setItems([
            ...items,
            {
              productId: product.id,
              productName: product.name,
              barcode: product.barcode,
              quantity: 1,
            },
          ]);
        }
        setBarcode("");
      } else {
        alert("Produkt nie znaleziony. Czy chcesz dodać nowy produkt do bazy?");
      }
    } catch (error) {
      console.error("Error finding product:", error);
      alert("Błąd podczas wyszukiwania produktu");
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
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          warehouseWorker,
          date,
          notes,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      if (response.ok) {
        const document = await response.json();
        router.push(`/documents/${document.id}`);
      } else {
        alert("Błąd podczas tworzenia dokumentu");
      }
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
            <form onSubmit={handleBarcodeSubmit} className="mb-6">
              <label className="block text-white mb-2 font-medium">
                Zeskanuj lub wpisz kod kreskowy
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Kod kreskowy (EAN-13)"
                  pattern="[0-9]{13}"
                  maxLength={13}
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
                >
                  Dodaj
                </button>
              </div>
            </form>

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
    </div>
  );
}
