"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
      id: string;
      name: string;
      barcode: string;
    };
  }[];
};

export default function DocumentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDocument();
    }
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${id}`);
      if (response.ok) {
        const data = await response.json();
        setDocument(data);
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
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
