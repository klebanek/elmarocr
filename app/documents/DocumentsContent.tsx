"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

type DocumentListItem = {
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

type DocumentDetail = {
  id: string;
  warehouseWorker: string;
  date: string;
  notes: string | null;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      barcode: string;
    };
  }[];
};

export default function DocumentsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const documentId = searchParams.get('id');

  // List view state
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [listLoading, setListLoading] = useState(true);

  // Detail view state
  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (documentId) {
      fetchDocument(documentId);
    } else {
      fetchDocuments();
    }
  }, [documentId]);

  const fetchDocuments = async () => {
    try {
      setListLoading(true);
      const { getAllDocumentsWithProducts } = await import('@/lib/storage');
      const data = getAllDocumentsWithProducts();
      setDocuments(data as any);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setListLoading(false);
    }
  };

  const fetchDocument = async (id: string) => {
    try {
      setDetailLoading(true);
      const { getDocumentWithProducts } = await import('@/lib/storage');
      const data = getDocumentWithProducts(id);
      setDocument(data as any);
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć ten dokument?")) return;

    try {
      const { deleteDocument } = await import('@/lib/storage');
      const success = deleteDocument(id);
      if (success) {
        fetchDocuments();
      } else {
        alert("Błąd podczas usuwania dokumentu");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Błąd podczas usuwania dokumentu");
    }
  };

  const getTotalItems = (doc: DocumentListItem) => {
    return doc.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const generatePDF = async () => {
    if (!document) return;

    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();

    // Nagłówek
    doc.setFontSize(20);
    doc.text("DOKUMENT WYDANIA MAGAZYNOWEGO", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Magazynier: ${document.warehouseWorker}`, 20, 40);
    doc.text(
      `Data: ${format(new Date(document.date), "d MMMM yyyy", { locale: pl })}`,
      20,
      50
    );

    if (document.notes) {
      doc.text(`Uwagi: ${document.notes}`, 20, 60);
    }

    // Tabela produktów
    const tableData = document.items.map((item, index) => [
      index + 1,
      item.product.barcode,
      item.product.name,
      item.quantity,
    ]);

    autoTable(doc, {
      startY: document.notes ? 70 : 60,
      head: [["Lp.", "Kod kreskowy", "Nazwa produktu", "Ilość"]],
      body: tableData,
      theme: "grid",
      styles: { font: "helvetica", fontSize: 10 },
      headStyles: { fillColor: [4, 98, 118] },
    });

    // Suma
    const totalQuantity = document.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Razem pozycji: ${document.items.length}`, 20, finalY);
    doc.text(`Suma sztuk: ${totalQuantity}`, 20, finalY + 10);

    // Podpis
    doc.text("_____________________", 20, finalY + 30);
    doc.setFontSize(10);
    doc.text("Podpis magazyniera", 20, finalY + 35);

    // Zapisz
    doc.save(
      `dokument_${document.warehouseWorker}_${format(
        new Date(document.date),
        "yyyy-MM-dd"
      )}.pdf`
    );
  };

  const generateExcel = async () => {
    if (!document) return;

    const XLSX = await import("xlsx");

    const worksheetData = [
      ["DOKUMENT WYDANIA MAGAZYNOWEGO"],
      [],
      ["Magazynier:", document.warehouseWorker],
      [
        "Data:",
        format(new Date(document.date), "d MMMM yyyy", { locale: pl }),
      ],
      ["Uwagi:", document.notes || "-"],
      [],
      ["Lp.", "Kod kreskowy", "Nazwa produktu", "Ilość"],
      ...document.items.map((item, index) => [
        index + 1,
        item.product.barcode,
        item.product.name,
        item.quantity,
      ]),
      [],
      [
        "Razem:",
        "",
        document.items.length + " poz.",
        document.items.reduce((sum, item) => sum + item.quantity, 0) + " szt.",
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dokument");

    XLSX.writeFile(
      workbook,
      `dokument_${document.warehouseWorker}_${format(
        new Date(document.date),
        "yyyy-MM-dd"
      )}.xlsx`
    );
  };

  // Detail view
  if (documentId) {
    if (detailLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-cyan-800 to-teal-900 flex items-center justify-center">
          <p className="text-white text-xl">Ładowanie...</p>
        </div>
      );
    }

    if (!document) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-cyan-800 to-teal-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white text-xl mb-4">Dokument nie znaleziony</p>
            <Link
              href="/documents"
              className="text-cyan-200 hover:text-white underline"
            >
              Powrót do listy
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-cyan-800 to-teal-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/documents"
              className="text-cyan-100 hover:text-white mb-4 inline-block"
            >
              ← Powrót do listy
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">
              Szczegóły Dokumentu
            </h1>
          </div>

          {/* Informacje o dokumencie */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Dane dokumentu
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-cyan-200 text-sm">Magazynier</p>
                <p className="text-white text-lg font-medium">
                  {document.warehouseWorker}
                </p>
              </div>
              <div>
                <p className="text-cyan-200 text-sm">Data</p>
                <p className="text-white text-lg font-medium">
                  {format(new Date(document.date), "d MMMM yyyy", { locale: pl })}
                </p>
              </div>
              {document.notes && (
                <div className="md:col-span-2">
                  <p className="text-cyan-200 text-sm">Uwagi</p>
                  <p className="text-white">{document.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Lista produktów */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Produkty ({document.items.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-cyan-100 pb-3 px-2">Lp.</th>
                    <th className="text-left text-cyan-100 pb-3 px-2">
                      Kod kreskowy
                    </th>
                    <th className="text-left text-cyan-100 pb-3 px-2">
                      Nazwa produktu
                    </th>
                    <th className="text-right text-cyan-100 pb-3 px-2">Ilość</th>
                  </tr>
                </thead>
                <tbody>
                  {document.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-white/10">
                      <td className="py-3 px-2 text-white">{index + 1}</td>
                      <td className="py-3 px-2 text-cyan-200 font-mono">
                        {item.product.barcode}
                      </td>
                      <td className="py-3 px-2 text-white">
                        {item.product.name}
                      </td>
                      <td className="py-3 px-2 text-white text-right font-medium">
                        {item.quantity} szt.
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td
                      colSpan={3}
                      className="pt-4 px-2 text-white text-right"
                    >
                      Razem:
                    </td>
                    <td className="pt-4 px-2 text-white text-right">
                      {document.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}{" "}
                      szt.
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Akcje */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={generatePDF}
              className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              📄 Generuj PDF
            </button>
            <button
              onClick={generateExcel}
              className="flex-1 px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              📊 Eksportuj Excel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List view
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
        {listLoading ? (
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
                      href={`/documents?id=${doc.id}`}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                    >
                      Szczegóły
                    </Link>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
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
