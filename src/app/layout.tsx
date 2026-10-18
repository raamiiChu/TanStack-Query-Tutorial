import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";

import { Toaster } from "sonner";

import { AppSidebar } from "@/components/app-sidebar";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TanStack Query Tutorial",
  description: "Advanced patterns for TanStack Query v5. 2026 © Ramy Chu",
  authors: [{ name: "Ramy Chu", url: "https://github.com/raamiiChu" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${notoSans.className} mx-auto antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <SidebarProvider>
              <AppSidebar />
              <main className="relative w-full">
                <SidebarTrigger className="bg-background border-accent sticky top-0 z-50 border-2 md:border-0" />
                <article className="container mx-auto px-4 pb-24 md:px-12 lg:px-24 xl:px-40 2xl:px-64">
                  {children}
                </article>
              </main>
            </SidebarProvider>
            <Toaster richColors position="top-center" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
