import type { Metadata } from "next";
import "./globals.css";
import NavigationBar from "./_components/navigation/navigation";
import { NavigationRoute } from "@/types/types";
import { AuthProvider } from "@/context/AuthContext";



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
      <body suppressHydrationWarning>
        <AuthProvider>
          <NavigationBar routes={routes}></NavigationBar>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}