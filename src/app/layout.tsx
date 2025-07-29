import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Gestión de inventario CMM",
  description: "Sistema de gestión de inventario para la Comunidad Maria Mediadora.",
  manifest: "/webmanifest.json",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CMM Inventario",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Sistema de Gestión de Inventario CMM",
    title: "Gestión de inventario CMM",
    description: "Sistema de gestión de inventario para la Comunidad Maria Mediadora.",
  },
  twitter: {
    card: "summary",
    title: "Gestión de inventario CMM",
    description: "Sistema de gestión de inventario para la Comunidad Maria Mediadora.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CMM Inventario" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className={`${lato.variable} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
        <Toaster position="top-center" richColors closeButton theme="light" />
      </body>
    </html>
  );
}
