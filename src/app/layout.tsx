import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ExchangeProvider } from "@/context/ExchangeContext";
import { Navbar } from "@/components/navigation/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CloudSkill Exchange — Student Peer Learning & Skill Exchange Platform",
  description:
    "A cloud-based peer-to-peer student skill exchange platform. Trade skills with campus peers, schedule live learning sessions, share resources, and grow together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
        <ExchangeProvider>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
        </ExchangeProvider>
      </body>
    </html>
  );
}
