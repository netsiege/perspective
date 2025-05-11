import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationBar from "./_components/navigation/navigation";
import { NavigationRoute } from "@/types/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Netsiege",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const routes: Array<NavigationRoute> = [
    {name: 'Dashboard', reference: 'dashboard'},
    {name: 'Control', reference: 'control'},
    {name: 'Services', reference: 'services'},
  ];

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NavigationBar routes={routes}></NavigationBar>
        <main>{children}</main>
      </body>
    </html>
  );
}