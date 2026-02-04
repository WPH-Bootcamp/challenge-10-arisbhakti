"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  fetchMostLikedPosts,
  fetchRecommendedPosts,
  fetchSearchPosts,
  fetchUserById,
} from "@/lib/tanstackQuery";
import { toggleLikePost } from "@/lib/api";
import Toast from "@/components/Toast";

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, "");

export default function Home() {
  const [page, setPage] = useState(1);
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("likedPostIds");
    if (stored) {
      try {
        setLikedIds(JSON.parse(stored));
      } catch {
        setLikedIds([]);
      }
    }
  }, []);

  useEffect(() => {
    const readSearch = () => {
      const stored = localStorage.getItem("searchQuery") || "";
      setSearchQuery(stored);
    };
    readSearch();
    window.addEventListener("search-updated", readSearch);
    return () => window.removeEventListener("search-updated", readSearch);
  }, []);

  const updateLikedStorage = (next: number[]) => {
    setLikedIds(next);
    localStorage.setItem("likedPostIds", JSON.stringify(next));
  };

  const handleToggleLike = async (postId: number) => {
    try {
      await toggleLikePost(postId);
      const isLiked = likedIds.includes(postId);
      const next = isLiked
        ? likedIds.filter((id) => id !== postId)
        : [...likedIds, postId];
      updateLikedStorage(next);
      setToastMessage(isLiked ? "Unliked post." : "Liked post.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      queryClient.invalidateQueries({ queryKey: ["recommended-posts"] });
      queryClient.invalidateQueries({ queryKey: ["most-liked-posts"] });
    } catch (error) {
      setToastMessage(
        error instanceof Error ? error.message : "Failed to like post.",
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

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

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useQuery({
    queryKey: ["search-posts", searchQuery],
    queryFn: () => fetchSearchPosts(searchQuery, 1, 100),
    enabled: !!searchQuery.trim(),
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
  const isSearchMode = !!searchQuery.trim();
  const searchPosts =
    searchData?.data.map((post) => ({
      ...post,
      excerpt: stripHtml(post.content),
    })) ?? [];
  const displayedPosts = isSearchMode ? searchPosts : recommendedPosts;
  const authorIds = useMemo(() => {
    const ids = displayedPosts.map((post) => post.author.id);
    return Array.from(new Set(ids));
  }, [displayedPosts]);
  const authorQueries = useQueries({
    queries: authorIds.map((id) => ({
      queryKey: ["post-author", id],
      queryFn: () => fetchUserById(id),
      enabled: authorIds.length > 0,
    })),
  });
  const authorMap = useMemo(() => {
    const map = new Map<number, { avatarUrl?: string }>();
    authorQueries.forEach((query, index) => {
      if (query.data) {
        map.set(authorIds[index], query.data);
      }
    });
    return map;
  }, [authorQueries, authorIds]);

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 py-10">
      <div
        className={`flex flex-col gap-10 ${isSearchMode ? "" : "lg:flex-row"}`}
      >
        <section className="w-full lg:flex-1">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl leading-8.5 -tracking-[0.03em] md:text-[28px] md-leading-[38px]">
              {isSearchMode
                ? `Search Results for “${searchQuery.trim()}”`
                : "Recommend For You"}
            </h2>
          </div>

          <div className="mt-6 space-y-8">
            {isSearchMode && isSearchLoading && (
              <div className="space-y-6">
                {[...Array(2)].map((_, index) => (
                  <div
                    key={`loading-search-${index}`}
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

            {isSearchMode && isSearchError && (
              <div className="rounded-2xl border border-[#fca5a5] bg-[#fee2e2] px-5 py-4 text-sm text-[#b91c1c]">
                Failed to load search results. Please try again.
              </div>
            )}

            {isSearchMode &&
              !isSearchLoading &&
              !isSearchError &&
              searchPosts.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                  <img
                    src="/empty-post-icon.png"
                    alt="No results"
                    className="h-24 w-24"
                  />
                  <p className="text-base font-semibold">No results found</p>
                  <p className="text-sm text-[#6b7280]">
                    Try using different keywords
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem("searchQuery", "");
                      setSearchQuery("");
                      window.dispatchEvent(new Event("search-updated"));
                    }}
                    className="mt-2 h-11 rounded-full bg-[#0b8bd3] px-8 text-sm font-semibold text-white"
                  >
                    Back to Home
                  </button>
                </div>
              )}

            {isSearchMode &&
              !isSearchLoading &&
              !isSearchError &&
              searchPosts.map((post) => (
                <article
                  key={`search-${post.id}`}
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
                          key={`${post.id}-search-${tag}`}
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
                            src={
                              authorMap.get(post.author.id)?.avatarUrl ||
                              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                            }
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
                      <button
                        type="button"
                        onClick={() => handleToggleLike(post.id)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <img
                          src={
                            likedIds.includes(post.id)
                              ? "/liked-icon.svg"
                              : "/like-icon.svg"
                          }
                          alt="Likes"
                          className="h-4 w-4"
                        />
                        <span className="text-neutral-600">{post.likes}</span>
                      </button>
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

            {!isSearchMode &&
              !isRecommendedLoading &&
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
                            src={
                              authorMap.get(post.author.id)?.avatarUrl ||
                              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                            }
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
                      <button
                        type="button"
                        onClick={() => handleToggleLike(post.id)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <img
                          src={
                            likedIds.includes(post.id)
                              ? "/liked-icon.svg"
                              : "/like-icon.svg"
                          }
                          alt="Likes"
                          className="h-4 w-4"
                        />
                        <span className="text-neutral-600">{post.likes}</span>
                      </button>
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

          {!isSearchMode && (
            <div className="mt-8 flex items-center justify-center gap-3 text-sm text-neutral-600">
              <button
                className="flex items-center gap-2 rounded-full px-4 py-2 disabled:opacity-50 cursor-pointer"
                onClick={() => handlePageChange(Math.max(1, page - 1))}
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
                    } cursor-pointer`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
              <button
                className="flex items-center gap-2 rounded-full px-4 py-2 disabled:opacity-50 cursor-pointer"
                onClick={() => handlePageChange(Math.min(lastPage, page + 1))}
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
          )}
        </section>

        {!isSearchMode && (
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
                          <button
                            type="button"
                            onClick={() => handleToggleLike(post.id)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <img
                              src={
                                likedIds.includes(post.id)
                                  ? "/liked-icon.svg"
                                  : "/like-icon.svg"
                              }
                              alt="Likes"
                              className="h-4 w-4"
                            />
                            <span className="text-neutral-600">
                              {post.likes}
                            </span>
                          </button>
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
                      </article>
                    ))}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
      {showToast && <Toast message={toastMessage} />}
    </main>
  );
}
