import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Geist_Mono,
  Instrument_Sans,
} from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { SessionProvider } from "@/lib/store";
import { Header } from "@/components/Header";
import { ToastProvider } from "@/components/Toast";

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TeamGen — split any group into fair random teams",
  description:
    "Type or paste names, import a CSV or Excel sheet, and get random teams in seconds. Track scores, add latecomers, and save sessions with Google sign-in.",
};

const themeScript = `(function(){try{var t=localStorage.getItem("teamgen:theme");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrument.variable} ${bricolage.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <AuthProvider>
          <SessionProvider>
            <ToastProvider>
              <Header />
              <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16">
                {children}
              </main>
            </ToastProvider>
          </SessionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
