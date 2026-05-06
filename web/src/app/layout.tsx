import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookBuds — Exchange Books with Friends",
  description: "A cozy marketplace for friends to list and exchange used books, modeled on the tactile charm of library cards and bookshelves.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col" style={{ background: "var(--page-bg)" }}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <footer className="relative mt-auto">
            <img
              src="/illustrations/footer.png"
              alt=""
              className="w-full h-auto block"
              style={{ mixBlendMode: "multiply" }}
              aria-hidden="true"
            />
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
