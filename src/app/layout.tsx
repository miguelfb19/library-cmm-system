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
  description:
    "Sistema de gestión de inventario para la Comunidad Maria Mediadora.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
    other: [
      {
        rel: "shortcut icon",
        url: "/icon.png",
      },
      {
        rel: "mask-icon",
        url: "/icon.png",
      },
      {
        rel: "icon",
        url: "/icon.png",
      },
      {
        rel: "apple-touch-icon",
        url: "/icon.png",
      },
    ],
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
    description:
      "Sistema de gestión de inventario para la Comunidad Maria Mediadora.",
  },
  twitter: {
    card: "summary",
    title: "Gestión de inventario CMM",
    description:
      "Sistema de gestión de inventario para la Comunidad Maria Mediadora.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${lato.variable} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
        <Toaster position="top-center" richColors closeButton theme="light" />
      </body>
    </html>
  );
}
