import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav, MobileNav } from "@/components/nav";
import { ThemeProvider } from "@/components/theme";
import { Toaster } from "@/components/toaster";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans-face",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
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
      className={`${jakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full md:h-dvh md:overflow-hidden">
        <ThemeProvider>
          <div className="md:flex md:h-full">
            <Nav />
            <main className="min-w-0 flex-1 md:p-3 md:pl-0">
              <div className="md:h-full md:overflow-y-auto md:rounded-panel md:border md:border-border md:bg-surface">
                <div className="w-full px-4 py-6 pb-24 md:px-8 md:pb-10">
                  {children}
                </div>
              </div>
            </main>
          </div>
          <MobileNav />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
