import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ELMAR Warehouse - System Magazynowy",
  description: "Aplikacja do zarządzania dokumentami magazynowymi",
  manifest: "/manifest.json",
  themeColor: "#046276",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ELMAR WH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
