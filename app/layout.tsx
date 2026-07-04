import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav, MobileNav } from "@/components/nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instagram Weekly Insights",
  description:
    "Weekly performance analytics, content ideas, and caption writing for your Instagram account.",
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
      <body className="min-h-full">
        <Nav />
        <main className="md:pl-60">
          <div className="mx-auto max-w-6xl px-4 md:px-8 py-6 pb-24 md:pb-10">
            {children}
          </div>
        </main>
        <MobileNav />
      </body>
    </html>
  );
}
