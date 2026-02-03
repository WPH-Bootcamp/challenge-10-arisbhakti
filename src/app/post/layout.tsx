import Footer from "@/components/Footer";
import PostHeader from "@/components/PostHeader";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <PostHeader title="Write Post" />
      {children}
      <Footer />
    </div>
  );
}
