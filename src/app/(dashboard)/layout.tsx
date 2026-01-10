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
  <body suppressHydrationWarning className="min-h-screen">
    <AuthProvider>
      <div className="flex min-h-screen">
        <NavigationBar routes={routes} />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthProvider>
  </body>
</html>
  );
}