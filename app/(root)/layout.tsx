import Sidebar from "@/components/sidebar/Sidebar";
import TokenRefreshInitializer from "@/components/auth/TokenRefreshInitializer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    redirect("/sign-in");
  }

  return (
    <main className="flex flex-row size-full font-inter">
      <TokenRefreshInitializer />
      <Sidebar />
      {children}
    </main>
  );
}
