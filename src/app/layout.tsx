import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoreProvider from "@/core/store/storeProvider";



export const metadata: Metadata = {
  title: "Fundwave",
  description: "A crowdfunding platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <StoreProvider>
        <Navbar/>
        {children}
        <Footer/>
        </StoreProvider>
      </body>
    </html>
  );
}
