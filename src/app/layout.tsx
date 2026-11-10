import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppContextProvider } from "./components/AppContext";
import AppLayout from "./components/AppLayout";

const monumentGrotesk = localFont({
  src: "../../public/media/ABCMonumentGroteskVariable.woff2",
  variable: "--font-monument"
});

export const metadata: Metadata = {
  title: "Hand of Naire",
  description: "Whats you need, i give it",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${monumentGrotesk.variable} ${monumentGrotesk.className} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AppContextProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </AppContextProvider>
      </body>
    </html>
  );
}
