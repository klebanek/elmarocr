import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-cyan-800 to-teal-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ELMAR Warehouse
          </h1>
          <p className="text-cyan-100 text-lg">
            System Magazynowy - Zarządzanie Dokumentami WZ
          </p>
        </header>

        {/* Main Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Nowy Dokument */}
          <Link href="/documents/new">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/20 shadow-xl hover:shadow-2xl hover:scale-105">
              <div className="text-5xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Nowy Dokument
              </h2>
              <p className="text-cyan-100">
                Utwórz nowy dokument wydania magazynowego
              </p>
            </div>
          </Link>

          {/* Lista Dokumentów */}
          <Link href="/documents">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/20 shadow-xl hover:shadow-2xl hover:scale-105">
              <div className="text-5xl mb-4">📋</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Lista Dokumentów
              </h2>
              <p className="text-cyan-100">
                Przeglądaj i zarządzaj dokumentami
              </p>
            </div>
          </Link>

          {/* Baza Produktów */}
          <Link href="/products">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/20 shadow-xl hover:shadow-2xl hover:scale-105">
              <div className="text-5xl mb-4">📦</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Baza Produktów
              </h2>
              <p className="text-cyan-100">
                Zarządzaj produktami i kodami kreskowymi
              </p>
            </div>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-lg rounded-xl px-6 py-3 border border-white/20">
            <p className="text-cyan-100 text-sm">
              💡 Aplikacja działa offline • Można zainstalować na urządzeniu mobilnym
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
