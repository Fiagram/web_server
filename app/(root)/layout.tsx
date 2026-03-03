import Sidebar from "@/components/sidebar/Sidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-row size-full font-inter">
      <Sidebar />
      {children}
    </main>
  );
}
