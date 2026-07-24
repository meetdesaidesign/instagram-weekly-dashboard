import type { Metadata } from "next";
import localFont from "next/font/local";
import { Fragment_Mono } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/nav";
import { ThemeProvider } from "@/components/theme";
import { Toaster } from "@/components/toaster";

const satoshi = localFont({
  src: [
    {
      path: "./fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-Bold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans-face",
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  weight: "400",
  variable: "--font-mono-face",
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
      suppressHydrationWarning
      className={`${satoshi.variable} ${fragmentMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider>
          <div className="flex min-h-full flex-col">
            <TopNav />
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
