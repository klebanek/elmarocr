"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

type Document = {
  id: string;
  warehouseWorker: string;
  date: string;
  notes: string | null;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    product: {
      name: string;
    };
  }[];
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/documents");
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć ten dokument?")) return;

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDocuments(documents.filter((doc) => doc.id !== id));
      } else {
        alert("Błąd podczas usuwania dokumentu");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Błąd podczas usuwania dokumentu");
    }
  };

  const getTotalItems = (doc: Document) => {
    return doc.items.reduce((sum, item) => sum + item.quantity, 0);
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
                Lista Dokumentów
              </h1>
              <p className="text-cyan-100">
                Przeglądaj i zarządzaj dokumentami magazynowymi
              </p>
            </div>
            <Link
              href="/documents/new"
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              + Nowy dokument
            </Link>
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-white text-xl">Ładowanie...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
            <p className="text-white text-xl mb-4">Brak dokumentów</p>
            <Link
              href="/documents/new"
              className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              Utwórz pierwszy dokument
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-2xl font-bold text-white">
                        {doc.warehouseWorker}
                      </h3>
                      <span className="px-3 py-1 bg-cyan-600/30 text-cyan-100 rounded-full text-sm">
                        {getTotalItems(doc)} szt.
                      </span>
                    </div>
                    <p className="text-cyan-200 mb-2">
                      Data: {format(new Date(doc.date), "d MMMM yyyy", { locale: pl })}
                    </p>
                    {doc.notes && (
                      <p className="text-cyan-100 text-sm mb-2">
                        Uwagi: {doc.notes}
                      </p>
                    )}
                    <p className="text-cyan-300 text-sm">
                      Utworzono:{" "}
                      {format(
                        new Date(doc.createdAt),
                        "d MMM yyyy, HH:mm",
                        { locale: pl }
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/documents/${doc.id}`}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                    >
                      Szczegóły
                    </Link>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="px-4 py-2 bg-red-600/80 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Usuń
                    </button>
                  </div>
                </div>

                {/* Podgląd produktów */}
                {doc.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-cyan-100 text-sm mb-2">Produkty:</p>
                    <div className="flex flex-wrap gap-2">
                      {doc.items.slice(0, 5).map((item) => (
                        <span
                          key={item.id}
                          className="px-3 py-1 bg-white/10 text-white rounded-lg text-sm"
                        >
                          {item.product.name} ({item.quantity} szt.)
                        </span>
                      ))}
                      {doc.items.length > 5 && (
                        <span className="px-3 py-1 text-cyan-200 text-sm">
                          +{doc.items.length - 5} więcej...
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
