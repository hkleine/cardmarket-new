import { Footer } from "@/components/footer";
import { TopNavigation } from "@/components/top-navigiation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between">
      <TopNavigation />
      <div className="p-8 w-full">{children}</div>
      <Footer />
    </main>
  );
}
