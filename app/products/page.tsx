"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  barcode: string;
  name: string;
  isManual: boolean;
  createdAt: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    barcode: "",
    name: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (search = "") => {
    try {
      const { getProducts, searchProducts } = await import('@/lib/storage');
      const data = search ? searchProducts(search) : getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(searchTerm);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProduct.barcode || !newProduct.name) {
      alert("Wypełnij wszystkie pola");
      return;
    }

    if (newProduct.barcode.length !== 13) {
      alert("Kod kreskowy musi mieć 13 cyfr");
      return;
    }

    try {
      const { addProduct } = await import('@/lib/storage');
      addProduct(newProduct.barcode, newProduct.name, true);
      setNewProduct({ barcode: "", name: "" });
      setShowAddForm(false);
      fetchProducts();
      alert("Produkt dodany pomyślnie!");
    } catch (error: any) {
      alert(error.message || "Błąd podczas dodawania produktu");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-cyan-800 to-teal-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-cyan-100 hover:text-white mb-4 inline-block"
          >
            ← Powrót do menu
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Baza Produktów
              </h1>
              <p className="text-cyan-100">Zarządzaj produktami i kodami kreskowymi</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              {showAddForm ? "Anuluj" : "+ Dodaj produkt"}
            </button>
          </div>
        </div>

        {/* Formularz dodawania */}
        {showAddForm && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Dodaj nowy produkt
            </h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-medium">
                  Kod kreskowy (EAN-13) *
                </label>
                <input
                  type="text"
                  value={newProduct.barcode}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, barcode: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono"
                  placeholder="1234567890123"
                  pattern="[0-9]{13}"
                  maxLength={13}
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2 font-medium">
                  Nazwa produktu *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Nazwa produktu"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
              >
                Dodaj produkt
              </button>
            </form>
          </div>
        )}

        {/* Wyszukiwarka */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Szukaj po nazwie lub kodzie kreskowym..."
            />
            <button
              type="submit"
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              🔍 Szukaj
            </button>
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  fetchProducts();
                }}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-colors"
              >
                Wyczyść
              </button>
            )}
          </form>
        </div>

        {/* Statystyki */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-cyan-200 text-sm mb-1">Wszystkie produkty</p>
              <p className="text-white text-3xl font-bold">{products.length}</p>
            </div>
            <div className="text-center">
              <p className="text-cyan-200 text-sm mb-1">Dodane ręcznie</p>
              <p className="text-white text-3xl font-bold">
                {products.filter((p) => p.isManual).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-cyan-200 text-sm mb-1">Z bazy</p>
              <p className="text-white text-3xl font-bold">
                {products.filter((p) => !p.isManual).length}
              </p>
            </div>
          </div>
        </div>

        {/* Lista produktów */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-white text-xl">Ładowanie...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
            <p className="text-white text-xl">Brak produktów</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10 border-b border-white/20">
                    <th className="text-left text-cyan-100 py-4 px-4">Lp.</th>
                    <th className="text-left text-cyan-100 py-4 px-4">
                      Kod kreskowy
                    </th>
                    <th className="text-left text-cyan-100 py-4 px-4">
                      Nazwa produktu
                    </th>
                    <th className="text-center text-cyan-100 py-4 px-4">
                      Źródło
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr
                      key={product.id}
                      className="border-b border-white/10 hover:bg-white/5"
                    >
                      <td className="py-4 px-4 text-white">{index + 1}</td>
                      <td className="py-4 px-4 text-cyan-200 font-mono">
                        {product.barcode}
                      </td>
                      <td className="py-4 px-4 text-white">{product.name}</td>
                      <td className="py-4 px-4 text-center">
                        {product.isManual ? (
                          <span className="px-3 py-1 bg-yellow-600/30 text-yellow-200 rounded-full text-sm">
                            Ręczny
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-600/30 text-green-200 rounded-full text-sm">
                            Baza
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
