import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "./components/AppContext";
import AppLayout from "./components/AppLayout";

const inter = Inter({ subsets: ["latin"] });

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
      className={`${inter.className} h-full antialiased`}
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
