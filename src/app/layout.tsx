import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Soumabrata Ghosh // Systems & Distributed Infrastructure",
  description:
    "Editorial portfolio of Soumabrata Ghosh (Souma061). High-throughput C++20 kernels, PR-Quadtree spatial proximity, atomic Redis Lua distributed state, Apache Kafka event relays, and low-latency search engines.",
  keywords: [
    "Soumabrata Ghosh",
    "Systems Engineer",
    "C++20",
    "Distributed Systems",
    "Redis Lua",
    "Kafka",
    "PR-Quadtree"
  ],
  authors: [{ name: "Soumabrata Ghosh", url: "https://github.com/Souma061" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-starfield text-[#f3e6d5] antialiased selection:bg-[#e86b1c]/30 selection:text-white">
        <SiteHeader />
        <main className="relative flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
