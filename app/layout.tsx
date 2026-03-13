// Root server layout: applies global styles and mounts client-only ErrorReporter.
import type { Metadata } from "next";
import "./globals.css";
import ErrorReporter from "../components/ErrorReporter";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme/theme-provider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Panda - SaaS App Builder Starter",
  description: "Production-ready SaaS app builder starter template with modern UI, dark mode, and launch-ready sections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ErrorReporter />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
