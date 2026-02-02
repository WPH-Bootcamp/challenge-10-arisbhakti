import Footer from "@/components/Footer";
import PostForm from "@/components/PostForm";
import PostHeader from "@/components/PostHeader";

export default function WritePostPage() {
  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <PostHeader title="Write Post" />

      <main className="px-6 py-10">
        <PostForm mode="write" />
      </main>

      <Footer />
    </div>
  );
}
