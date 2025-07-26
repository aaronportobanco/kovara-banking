import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      {children}
      <Toaster richColors/>
    </main>
  );
}
