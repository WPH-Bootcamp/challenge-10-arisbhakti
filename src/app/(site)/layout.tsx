import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col">
      <Header />
      <div className="pt-0 md:pt-0 flex-1">{children}</div>
      <Footer />
    </div>
  );
}
