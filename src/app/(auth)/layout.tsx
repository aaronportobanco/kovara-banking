import { Toaster } from "@/app/components/ui/sonner";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  return (
    <main className="flex min-h-screen w-full justify-between">
      {children}
      <div className="auth-asset">
        <div>
          <Image src="/icons/auth-image.svg" alt="Auth Asset" height={500} width={500} />
        </div>
      </div>
      <Toaster richColors />
    </main>
  );
}
