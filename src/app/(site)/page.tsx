"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { fetchMostLikedPosts, fetchRecommendedPosts } from "@/lib/tanstackQuery";

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, "");

export default function Home() {
  const [page, setPage] = useState(1);

  const {
    data: recommendedData,
    isLoading: isRecommendedLoading,
    isError: isRecommendedError,
  } = useQuery({
    queryKey: ["recommended-posts", page],
    queryFn: () => fetchRecommendedPosts(page, 5),
  });

  const {
    data: mostLikedData,
    isLoading: isMostLikedLoading,
    isError: isMostLikedError,
  } = useQuery({
    queryKey: ["most-liked-posts"],
    queryFn: () => fetchMostLikedPosts(1, 3),
  });

  const recommendedPosts = useMemo(() => {
    return (
      recommendedData?.data.map((post) => ({
        ...post,
        excerpt: stripHtml(post.content),
      })) ?? []
    );
  }, [recommendedData]);

  const mostLikedPosts = useMemo(() => {
    return (
      mostLikedData?.data.map((post) => ({
        ...post,
        excerpt: stripHtml(post.content),
      })) ?? []
    );
  }, [mostLikedData]);

  const lastPage = recommendedData?.lastPage ?? 1;
  const pages = Array.from({ length: lastPage }, (_, index) => index + 1);

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 py-10">
      <div className="flex flex-col gap-10 lg:flex-row">
        <section className="w-full lg:flex-1">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl leading-8.5 -tracking-[0.03em] md:text-[28px] md-leading-[38px]">
              Recommend For You
            </h2>
          </div>

          <div className="mt-6 space-y-8">
            {isRecommendedLoading && (
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={`loading-${index}`}
                    className="flex flex-col gap-5 border-b border-[#e7e9ee] pb-8 md:flex-row md:items-stretch"
                  >
                    <div className="hidden md:flex md:h-64.5 md:w-85 rounded-[6px] bg-[#eef0f4] animate-pulse" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-3/4 rounded bg-[#eef0f4] animate-pulse" />
                      <div className="h-4 w-1/2 rounded bg-[#eef0f4] animate-pulse" />
                      <div className="h-4 w-full rounded bg-[#eef0f4] animate-pulse" />
                      <div className="h-4 w-2/3 rounded bg-[#eef0f4] animate-pulse" />
                      <div className="h-4 w-1/3 rounded bg-[#eef0f4] animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isRecommendedError && (
              <div className="rounded-2xl border border-[#fca5a5] bg-[#fee2e2] px-5 py-4 text-sm text-[#b91c1c]">
                Failed to load posts. Please try again.
              </div>
            )}

            {!isRecommendedLoading &&
              !isRecommendedError &&
              recommendedPosts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col gap-5 border-b border-[#e7e9ee] pb-8 md:flex-row md:items-stretch "
                >
                  <Link href={`/detail/${post.id}`} className="hidden md:flex">
                    <img
                      src={post.imageUrl || "/dummy-home-article.png"}
                      alt={post.title}
                      className="rounded-[6px] object-cover md:h-64.5 md:w-85"
                    />
                  </Link>
                  <div className="flex-1 space-y-3">
                    <Link href={`/detail/${post.id}`}>
                      <h3 className="text-base font-bold leading-7.5 -tracking-[0.03em] md:text-xl md:leading-8.5">
                        {post.title}
                      </h3>
                    </Link>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={`${post.id}-${tag}`}
                          className="rounded-full ring ring-inset ring-neutral-300 py-1 px-3 text-xs leading-6 -tracking-[0.03em] text-neutral-900"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs leading-6 -tracking-[0.03em] md:text-sm md:leading-7 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[#6b7280]">
                      <Link
                        href={`/profile/${post.author.id}`}
                        className="flex items-center gap-2"
                      >
                        <div className="h-7 w-7 overflow-hidden rounded-full bg-[#e5e7eb]">
                          <img
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                            alt={post.author.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium text-[#111827]">
                          {post.author.name}
                        </span>
                      </Link>
                      <span>•</span>
                      <span className="text-neutral-600">
                        {new Date(post.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#6b7280]">
                      <div className="flex items-center gap-2">
                        <img
                          src="/like-icon.svg"
                          alt="Likes"
                          className="h-4 w-4"
                        />
                        <span className="text-neutral-600">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          src="/comment-icon.svg"
                          alt="Comments"
                          className="h-4 w-4"
                        />
                        <span className="text-neutral-600">
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 text-sm text-neutral-600">
            <button
              className="flex items-center gap-2 rounded-full px-4 py-2 disabled:opacity-50"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Previous
            </button>
            <div className="flex items-center gap-2">
              {pages.map((pageNumber) => (
                <button
                  key={pageNumber}
                  className={`h-9 w-9 rounded-full border border-[#e7e9ee] ${
                    pageNumber === page
                      ? "bg-[#0b8bd3] text-white"
                      : "text-neutral-600"
                  }`}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
            <button
              className="flex items-center gap-2 rounded-full px-4 py-2 disabled:opacity-50"
              onClick={() => setPage((prev) => Math.min(lastPage, prev + 1))}
              disabled={page === lastPage}
            >
              Next
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </section>

        <aside className="w-full lg:w-[320px]">
          <div className="lg:sticky lg:top-8">
            <div className="lg:border-l lg:border-[#e7e9ee] lg:pl-6">
              <h2 className="text-xl font-bold leading-8.5 -tracking-[0.03em md:text-2xl md:leading-9">
                Most Liked
              </h2>
              <div className="mt-6 space-y-6">
                {isMostLikedLoading && (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div
                        key={`loading-liked-${index}`}
                        className="space-y-2 border-b border-[#e7e9ee] pb-6"
                      >
                        <div className="h-4 w-3/4 rounded bg-[#eef0f4] animate-pulse" />
                        <div className="h-3 w-full rounded bg-[#eef0f4] animate-pulse" />
                        <div className="h-3 w-1/2 rounded bg-[#eef0f4] animate-pulse" />
                      </div>
                    ))}
                  </div>
                )}

                {isMostLikedError && (
                  <div className="rounded-2xl border border-[#fca5a5] bg-[#fee2e2] px-5 py-4 text-sm text-[#b91c1c]">
                    Failed to load most liked posts.
                  </div>
                )}

                {!isMostLikedLoading &&
                  !isMostLikedError &&
                  mostLikedPosts.map((post) => (
                  <article
                    key={post.id}
                    className="space-y-3 border-b border-[#e7e9ee] pb-6"
                  >
                    <Link href={`/detail/${post.id}`}>
                      <h3 className="text-base leading-7.5 -tracking-[0.03em] font-bold">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-xs leading-6 -tracking-[0.03em] md:text-sm md:leading-7 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-[#6b7280]">
                      <div className="flex items-center gap-2">
                        <img
                          src="/like-icon.svg"
                          alt="Likes"
                          className="h-4 w-4"
                        />
                        <span className="text-neutral-600">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          src="/comment-icon.svg"
                          alt="Comments"
                          className="h-4 w-4"
                        />
                        <span className="text-neutral-600">{post.comments}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
