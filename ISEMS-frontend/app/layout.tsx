import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/shared/sidebar";
import { Header } from "@/components/shared/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ISEMS - Smart AC Control System",
  description: "Intelligent Energy Monitoring System for Air Conditioning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 antialiased`}>
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="ml-64">
          {/* Header */}
          <Header />
          
          {/* Page Content */}
          <main className="mt-16 min-h-screen p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}