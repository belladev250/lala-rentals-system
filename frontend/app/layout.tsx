import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/AuthContext";



export const metadata: Metadata = {
  title: "LALA RENTALS",
  description: "A RENTING SYSTEM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <AuthProvider>
      <body>
      
        {children}
      </body>
      </AuthProvider>
    </html>
  );
}
