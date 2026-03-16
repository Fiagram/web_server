import Sidebar from "@/components/sidebar/Sidebar";
import TokenRefreshInitializer from "@/components/auth/TokenRefreshInitializer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-row size-full font-inter">
      <TokenRefreshInitializer />
      <Sidebar />
      {children}
    </main>
  );
}
