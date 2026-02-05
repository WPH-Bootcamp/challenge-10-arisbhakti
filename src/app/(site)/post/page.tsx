"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import PostForm from "@/components/PostForm";
import { fetchPostDetail } from "@/lib/tanstackQuery";

export default function WritePostPage() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("id");
  const postId = rawId ? Number(rawId) : NaN;
  const isEdit = Number.isFinite(postId) && postId > 0;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["post-detail", postId],
    queryFn: () => fetchPostDetail(postId),
    enabled: isEdit,
  });

  if (isEdit && isLoading) {
    return (
      <main className="px-6 py-10">
        <div className="mx-auto w-full max-w-2xl space-y-6 animate-pulse">
          <div className="h-10 rounded-xl bg-[#eef0f4]" />
          <div className="h-60 rounded-xl bg-[#eef0f4]" />
          <div className="h-40 rounded-xl bg-[#eef0f4]" />
        </div>
      </main>
    );
  }

  if (isEdit && isError) {
    return (
      <main className="px-6 py-10">
        <div className="mx-auto w-full max-w-2xl rounded-2xl border border-[#fca5a5] bg-[#fee2e2] px-5 py-4 text-sm text-[#b91c1c]">
          Failed to load post data.
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-10">
      <PostForm
        mode={isEdit ? "edit" : "write"}
        postId={isEdit ? postId : undefined}
        initialData={
          isEdit && data
            ? {
                title: data.title,
                content: data.content,
                tags: data.tags,
                imageUrl: data.imageUrl,
              }
            : undefined
        }
      />
    </main>
  );
}
