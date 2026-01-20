import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Use Inter as per plan but keeping Geist since it's default
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "부동산마켓",
  description: "최고의 부동산 매물을 찾아보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 text-gray-900 font-sans`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
