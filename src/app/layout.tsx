import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ichsanfachri.my.id"),
  title: "Ichsan Fachri Siroj — Solution Architect & WebGIS Developer",
  description:
    "Portfolio of Ichsan Fachri Siroj — Solution Architect, Full-Stack & WebGIS Developer. Geodesy and Geomatics Engineering graduate, ITB.",
  openGraph: { type: "website", title: "Ichsan Fachri Siroj", siteName: "Ichsan Fachri Siroj" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
