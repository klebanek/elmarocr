"use client";

import { Suspense } from "react";
import DocumentsContent from "./DocumentsContent";

export default function DocumentsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-cyan-800 to-teal-900 flex items-center justify-center">
          <p className="text-white text-xl">Ładowanie...</p>
        </div>
      }
    >
      <DocumentsContent />
    </Suspense>
  );
}
