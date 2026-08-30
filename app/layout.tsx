import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialRail from "@/components/SocialRail";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Hussein Abdow | Portfolio",
  description: "I build what people use — and design how it feels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-bg text-ink font-body antialiased min-h-screen">
        <Navbar />
        <SocialRail />
        {children}
        <Footer />
        <div
          aria-hidden
          className="grain-overlay pointer-events-none fixed inset-0 z-[60]"
        />
      </body>
    </html>
  );
}
