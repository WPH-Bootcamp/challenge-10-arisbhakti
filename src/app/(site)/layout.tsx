import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col">
      <div className="fixed left-0 top-0 z-50 w-full">
        <Header />
      </div>
      <div className="pt-20 flex-1">{children}</div>
      <Footer />
    </div>
  );
}
