import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppContextProvider } from "./components/AppContext";
import AppLayout from "./components/AppLayout";

const innovatorGrostek = localFont({
  src: "../../public/media/font/innovatorGrostek.woff2",
  variable: "--font-innovator"
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
      className={`${innovatorGrostek.variable} ${helveticaNeue.variable} ${innovatorGrostek.className} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
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