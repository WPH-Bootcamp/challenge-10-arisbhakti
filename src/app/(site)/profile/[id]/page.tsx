"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  fetchMeProfile,
  fetchUserById,
  fetchUserByUsername,
} from "@/lib/tanstackQuery";

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, "");

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function ProfilePage() {
  const params = useParams();
  const paramId = params?.id?.toString();
  const isMe = paramId === "me";
  const numericId = Number(paramId);
  const [activeTab, setActiveTab] = useState<"posts" | "password">("posts");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["profile", paramId],
    queryFn: () => {
      if (isMe) {
        if (!token) throw new Error("Not authenticated");
        return fetchMeProfile(token);
      }
      return fetchUserById(numericId);
    },
    enabled: isMe ? !!token : Number.isFinite(numericId),
  });

  const {
    data: userPosts,
    isLoading: isPostsLoading,
    isError: isPostsError,
  } = useQuery({
    queryKey: ["profile-posts", profile?.username],
    queryFn: () => fetchUserByUsername(profile!.username, 1, 100),
    enabled: !!profile?.username,
  });

  const posts = useMemo(() => userPosts?.posts.data ?? [], [userPosts]);
  const postsCount = posts.length;

  if (isProfileLoading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mx-auto w-full max-w-3xl space-y-6 animate-pulse">
          <div className="h-20 rounded-2xl bg-[#eef0f4]" />
          <div className="h-10 rounded bg-[#eef0f4]" />
          <div className="h-60 rounded-2xl bg-[#eef0f4]" />
        </div>
      </main>
    );
  }

  if (isProfileError || !profile) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="rounded-2xl border border-[#fca5a5] bg-[#fee2e2] px-5 py-4 text-sm text-[#b91c1c]">
          Failed to load profile.
        </div>
      </main>
    );
  }

  const avatarSrc =
    profile.avatarUrl ||
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80";
  const headline = profile.headline || "Frontend Developer";

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section
        className={`mx-auto w-full max-w-3xl px-6 py-5 ${
          isMe ? "rounded-2xl border border-[#e7e9ee]" : ""
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 overflow-hidden rounded-full bg-[#e5e7eb]">
              <img
                src={avatarSrc}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-base font-semibold">{profile.name}</p>
              <p className="text-sm text-[#6b7280]">{headline}</p>
            </div>
          </div>
          {isMe && (
            <a
              href="#"
              className="text-sm font-semibold text-[#0b8bd3] underline underline-offset-2 cursor-pointer"
            >
              Edit Profile
            </a>
          )}
        </div>
      </section>

      {isMe ? (
        <section className="mx-auto mt-6 w-full max-w-3xl">
          <div className="flex gap-6 border-b border-[#e7e9ee] text-sm">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 pb-3 font-semibold transition ${
                activeTab === "posts"
                  ? "border-b-2 border-[#0b8bd3] text-[#0b8bd3]"
                  : "text-[#6b7280]"
              }`}
            >
              Your Post
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`px-4 pb-3 font-semibold transition ${
                activeTab === "password"
                  ? "border-b-2 border-[#0b8bd3] text-[#0b8bd3]"
                  : "text-[#6b7280]"
              }`}
            >
              Change Password
            </button>
          </div>
        </section>
      ) : (
        <div className="mx-auto mt-6 w-full max-w-3xl border-b border-[#e7e9ee]" />
      )}

      <div className="mx-auto mt-5 w-full max-w-3xl">
        <div
          className={`transition-all duration-300 ${
            activeTab === "posts"
              ? "opacity-100 translate-y-0"
              : "pointer-events-none h-0 opacity-0 -translate-y-2 overflow-hidden"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            {postsCount > 0 ? (
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">{postsCount} Post</span>
              </div>
            ) : (
              <div />
            )}
            {isMe && postsCount > 0 && (
              <button className="flex items-center gap-2 rounded-full bg-[#0b8bd3] px-6 py-2 text-sm font-semibold text-white">
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
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
                Write Post
              </button>
            )}
          </div>

          {isPostsLoading ? (
            <div className="mt-6 space-y-6">
              {[...Array(2)].map((_, index) => (
                <div
                  key={`loading-post-${index}`}
                  className="h-40 rounded-2xl bg-[#eef0f4] animate-pulse"
                />
              ))}
            </div>
          ) : isPostsError ? (
            <div className="mt-6 rounded-2xl border border-[#fca5a5] bg-[#fee2e2] px-5 py-4 text-sm text-[#b91c1c]">
              Failed to load posts.
            </div>
          ) : postsCount === 0 ? (
            <div className="mt-12 flex flex-col items-center gap-4 text-center">
              <img
                src="/empty-post-icon.png"
                alt="Empty post"
                className="h-24 w-24"
              />
              {isMe ? (
                <>
                  <p className="text-base font-semibold">
                    Your writing journey starts here
                  </p>
                  <p className="text-sm text-[#6b7280]">
                    No posts yet, but every great writer starts with the first
                    one.
                  </p>
                  <button className="mt-2 flex items-center gap-2 rounded-full bg-[#0b8bd3] px-8 py-3 text-sm font-semibold text-white">
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
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                    Write Post
                  </button>
                </>
              ) : (
                <>
                  <p className="text-base font-semibold">No posts available</p>
                  <p className="text-sm text-[#6b7280]">
                    This user hasn't published any posts yet.
                  </p>
                </>
              )}
            </div>
          ) : (
            <section className="mt-6 space-y-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col gap-5 border-b border-[#e7e9ee] pb-6 sm:flex-row sm:items-stretch"
                >
                  <a href={`/detail/${post.id}`}>
                    <img
                      src={post.imageUrl || "/dummy-home-article.png"}
                      alt={post.title}
                      className="h-[190px] w-full rounded-2xl object-cover sm:h-[190px] sm:w-[260px]"
                    />
                  </a>

                  <div className="flex-1 sm:flex sm:min-h-[190px] sm:flex-col sm:justify-between">
                    <div className="space-y-3">
                      <a href={`/detail/${post.id}`}>
                        <h3 className="text-base font-semibold">
                          {post.title}sss
                        </h3>
                      </a>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={`${post.id}-${tag}`}
                            className="rounded-full border border-[#dfe3ea] px-3 py-1 text-xs text-[#4b5563]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-[#6b7280]">
                        {stripHtml(post.content).slice(0, 140)}...
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#6b7280]">
                        <span>{formatDate(post.createdAt)}</span>
                        <span className="h-3 w-px bg-[#d1d5db]" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>

                    {isMe && (
                      <div className="mt-4 flex items-center gap-4 text-sm sm:mt-0">
                        <a
                          href="#"
                          className="font-semibold text-[#0b8bd3] underline underline-offset-2"
                        >
                          Statistic
                        </a>
                        <span className="h-5 w-px bg-[#d1d5db]" />
                        <a
                          href={`/post?id=${post.id}`}
                          className="font-semibold text-[#0b8bd3] underline underline-offset-2"
                        >
                          Edit
                        </a>
                        <span className="h-5 w-px bg-[#d1d5db]" />
                        <a
                          href="#"
                          className="font-semibold text-[#ef4444] underline underline-offset-2"
                        >
                          Delete
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>

        {isMe && (
          <div
            className={`transition-all duration-300 ${
              activeTab === "password"
                ? "mt-6 opacity-100 translate-y-0"
                : "pointer-events-none h-0 opacity-0 -translate-y-2 overflow-hidden"
            }`}
          >
            <form className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="h-12 w-full rounded-xl border border-[#d9dce3] px-4 pr-11 text-sm outline-none transition focus:border-[#0b8bd3] focus:ring-2 focus:ring-[#0b8bd3]/20"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0f172a]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2.46 12s3.74-7 9.54-7 9.54 7 9.54 7-3.74 7-9.54 7-9.54-7-9.54-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="h-12 w-full rounded-xl border border-[#d9dce3] px-4 pr-11 text-sm outline-none transition focus:border-[#0b8bd3] focus:ring-2 focus:ring-[#0b8bd3]/20"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0f172a]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2.46 12s3.74-7 9.54-7 9.54 7 9.54 7-3.74 7-9.54 7-9.54-7-9.54-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter confirm new password"
                    className="h-12 w-full rounded-xl border border-[#d9dce3] px-4 pr-11 text-sm outline-none transition focus:border-[#0b8bd3] focus:ring-2 focus:ring-[#0b8bd3]/20"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0f172a]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2.46 12s3.74-7 9.54-7 9.54 7 9.54 7-3.74 7-9.54 7-9.54-7-9.54-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="h-12 w-full rounded-full bg-[#0b8bd3] text-sm font-semibold text-white"
              >
                Update Password
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
