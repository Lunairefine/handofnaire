import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AppContextProvider } from "./components/AppContext";
import AppLayout from "./components/AppLayout";

const ibmPlexMono = IBM_Plex_Mono({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex"
});

const helveticaNeue = localFont({
  src: "../../public/media/font/HelveticaNeueMedium-s.p.3ee6673a.otf",
  variable: "--font-helvetica"
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
      className={`${ibmPlexMono.variable} ${helveticaNeue.variable} ${helveticaNeue.className} h-full antialiased`}
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