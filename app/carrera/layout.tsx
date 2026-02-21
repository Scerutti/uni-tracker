import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";

export default function CarreraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  );
}
