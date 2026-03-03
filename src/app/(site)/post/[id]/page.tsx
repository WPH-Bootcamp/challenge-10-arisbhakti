import PostForm from "@/components/PostForm";

export default function EditPostPage() {
  return (
    <main className="px-6 py-10">
      <PostForm mode="edit" />
    </main>
  );
}
