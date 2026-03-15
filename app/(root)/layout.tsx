import Sidebar from "@/components/sidebar/Sidebar";
import TokenRefreshInitializer from "@/components/auth/TokenRefreshInitializer";
import { getLoggedInAccount } from "@/lib/actions/account.actions";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getLoggedInAccount();
  if (!loggedIn) redirect('/sign-in')


  return (
    <main className="flex flex-row size-full font-inter">
      <TokenRefreshInitializer />
      <Sidebar account={loggedIn} />
      {children}
    </main>
  );
}
