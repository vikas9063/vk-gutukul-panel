
import { Header } from "@/components/Header";
import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <div className="h-14 flex items-center shadow-sm shadow-accent w-full justify-between px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Header />
            </div>
            <div>
              Profile
            </div>
          </div>
          <section className="p-3">            
            {children}
          </section>
        </main>
      </SidebarProvider>
    </main>
  );
}
