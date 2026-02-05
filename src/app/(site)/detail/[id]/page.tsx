"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPostComments,
  fetchPostDetail,
  fetchUserById,
  fetchUserByUsername,
} from "@/lib/tanstackQuery";
import { createComment, toggleLikePost } from "@/lib/api";
import { getAuthPayload } from "@/lib/auth";
import { getApiErrorMessage } from "@/lib/apiError";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Toast from "@/components/Toast";

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, "");

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function DetailPage() {
  const params = useParams();
  const postId = Number(params?.id);
  const queryClient = useQueryClient();
  const [commentValue, setCommentValue] = useState("");
  const [commentError, setCommentError] = useState("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [modalCommentValue, setModalCommentValue] = useState("");
  const [modalCommentError, setModalCommentError] = useState("");
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState<"success" | "error">(
    "success",
  );
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const authPayload = getAuthPayload(token);
  const authUserId = authPayload?.id;

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

  const updateLikedStorage = (next: number[]) => {
    setLikedIds(next);
    localStorage.setItem("likedPostIds", JSON.stringify(next));
  };

  const handleToggleLike = async () => {
    if (!post) return;
    try {
      const isLiked = likedIds.includes(post.id);
      const next = isLiked
        ? likedIds.filter((id) => id !== post.id)
        : [...likedIds, post.id];
      await toggleLikePost(post.id);
      updateLikedStorage(next);
      setToastVariant("success");
      setToastMessage(isLiked ? "Unliked post." : "Liked post.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      queryClient.invalidateQueries({ queryKey: ["post-detail", post.id] });
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to like post.");
      setToastVariant("error");
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
  } = useQuery({
    queryKey: ["post-detail", postId],
    queryFn: () => fetchPostDetail(postId),
    enabled: Number.isFinite(postId),
  });

  const {
    data: author,
    isLoading: isAuthorLoading,
    isError: isAuthorError,
  } = useQuery({
    queryKey: ["post-author", post?.author.id],
    queryFn: () => fetchUserById(post!.author.id),
    enabled: !!post?.author.id,
  });

  const { data: currentUser } = useQuery({
    queryKey: ["auth-user", authUserId],
    queryFn: () => fetchUserById(authUserId!),
    enabled: !!authUserId,
  });

  const {
    data: comments,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
  } = useQuery({
    queryKey: ["post-comments", postId],
    queryFn: () => fetchPostComments(postId),
    enabled: Number.isFinite(postId),
  });

  const {
    data: authorPosts,
    isLoading: isAuthorPostsLoading,
    isError: isAuthorPostsError,
  } = useQuery({
    queryKey: ["author-posts", post?.author.username],
    queryFn: () => fetchUserByUsername(post!.author.username, 1, 10),
    enabled: !!post?.author.username,
  });

  const latestComments = useMemo(() => {
    const items = comments ?? [];
    return [...items]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 3);
  }, [comments]);

  const anotherPost = useMemo(() => {
    const posts = authorPosts?.posts.data ?? [];
    const filtered = posts.filter((item) => item.id !== post?.id);
    if (!filtered.length) return null;
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
  }, [authorPosts, post?.id]);

  const isLoading =
    isPostLoading ||
    isAuthorLoading ||
    isCommentsLoading ||
    isAuthorPostsLoading;
  const isError =
    isPostError || isAuthorError || isCommentsError || isAuthorPostsError;

  const handleSubmitComment = async (isModal = false) => {
    const value = isModal ? modalCommentValue : commentValue;
    if (!value.trim()) {
      const message = "Comment content cannot be empty";
      if (isModal) {
        setModalCommentError(message);
      } else {
        setCommentError(message);
      }
      return;
    }
    try {
      if (isModal) {
        setIsModalSubmitting(true);
        setModalCommentError("");
      } else {
        setIsCommentSubmitting(true);
        setCommentError("");
      }
      const response = await createComment(postId, { content: value.trim() });
      queryClient.setQueryData(
        ["post-comments", postId],
        (prev: typeof comments) => {
          const current = prev ?? [];
          return [response as any, ...current];
        },
      );
      if (isModal) {
        setModalCommentValue("");
      } else {
        setCommentValue("");
      }
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to post comment");
      if (isModal) {
        setModalCommentError(message);
      } else {
        setCommentError(message);
      }
    } finally {
      if (isModal) {
        setIsModalSubmitting(false);
      } else {
        setIsCommentSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="space-y-6 animate-pulse">
          <div className="h-7 w-3/4 rounded bg-[#eef0f4]" />
          <div className="h-4 w-1/2 rounded bg-[#eef0f4]" />
          <div className="h-4 w-2/3 rounded bg-[#eef0f4]" />
          <div className="h-[220px] w-full rounded-2xl bg-[#eef0f4]" />
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-[#eef0f4]" />
            <div className="h-4 w-full rounded bg-[#eef0f4]" />
            <div className="h-4 w-4/5 rounded bg-[#eef0f4]" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !post) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="rounded-2xl border border-[#fca5a5] bg-[#fee2e2] px-5 py-4 text-sm text-[#b91c1c]">
          Failed to load post detail. Please try again.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold sm:text-3xl">{post.title}</h1>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#dfe3ea] px-3 py-1 text-xs text-[#4b5563]"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#6b7280]">
          <Link
            href={`/profile/${post.author.id}`}
            className="flex items-center gap-2"
          >
            <div className="h-7 w-7 overflow-hidden rounded-full bg-[#e5e7eb]">
              <img
                src={author?.avatarUrl || "/dummy-home-article.png"}
                alt={author?.name || post.author.name}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-[#111827]">
              {author?.name || post.author.name}
            </span>
          </Link>
          <span>•</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <div className="flex items-center gap-4 border-y border-[#eef0f4] py-3 text-xs text-[#6b7280]">
          <button
            type="button"
            onClick={handleToggleLike}
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
            <span>{post.likes}</span>
          </button>
          <div className="flex items-center gap-2">
            <img src="/comment-icon.svg" alt="Comments" className="h-4 w-4" />
            <span>{comments?.length ?? 0}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <img
          src={post.imageUrl || "/dummy-home-article.png"}
          alt={post.title}
          className="h-[220px] w-full rounded-2xl object-cover sm:h-[360px]"
        />
      </div>

      <article
        className="prose prose-sm mt-6 max-w-none text-[#374151]"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <section className="mt-10 border-t border-[#eef0f4] pt-8">
        <h2 className="text-lg font-semibold">
          Comments({comments?.length ?? 0})
        </h2>
        <div className="mt-4 flex items-center gap-3">
          <Link
            href={`/profile/${currentUser?.id ?? "me"}`}
            className="flex items-center gap-2"
          >
            <div className="h-9 w-9 overflow-hidden rounded-full bg-[#e5e7eb]">
              <img
                src={
                  currentUser?.avatarUrl ||
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                }
                alt={currentUser?.name || "User"}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-sm font-semibold">
              {currentUser?.name || authPayload?.username || "User"}
            </span>
          </Link>
        </div>
        <p className="mt-3 text-sm text-[#6b7280]">Give your Comments</p>
        <div className="mt-3 space-y-4">
          <textarea
            placeholder="Enter your comment"
            value={commentValue}
            onChange={(event) => {
              setCommentValue(event.target.value);
              if (commentError) setCommentError("");
            }}
            className="h-28 w-full resize-none rounded-2xl border border-[#e1e5eb] px-4 py-3 text-sm outline-none focus:border-[#0b8bd3] focus:ring-2 focus:ring-[#0b8bd3]/20"
          />
          {commentError && (
            <p className="text-xs text-[#f43f5e]">{commentError}</p>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => handleSubmitComment(false)}
              disabled={isCommentSubmitting}
              className="flex h-11 w-32 items-center justify-center gap-2 rounded-full bg-[#0b8bd3] text-sm font-semibold text-white disabled:opacity-80"
            >
              {isCommentSubmitting && (
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                  />
                </svg>
              )}
              {isCommentSubmitting ? "Sending..." : "Send"}
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-6 border-t border-[#eef0f4] pt-6">
          {latestComments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Link
                href={`/profile/${comment.author.id}`}
                className="h-9 w-9 overflow-hidden rounded-full bg-[#e5e7eb]"
              >
                <img
                  src={
                    comment.author.avatarUrl ||
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                  }
                  alt={comment.author.name}
                  className="h-full w-full object-cover"
                />
              </Link>
              <div className="flex-1">
                <Link
                  href={`/profile/${comment.author.id}`}
                  className="flex items-center gap-2 text-sm font-semibold"
                >
                  {comment.author.name}
                </Link>
                <p className="text-xs text-[#6b7280]">
                  {formatDate(comment.createdAt)}
                </p>
                <p className="mt-2 text-sm text-[#4b5563]">{comment.content}</p>
              </div>
            </div>
          ))}
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="text-left text-sm font-semibold text-primary-300 cursor-pointer"
              >
                See All Comments
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Comments({comments?.length ?? 0})</DialogTitle>
                <DialogClose asChild>
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#111827]"
                    aria-label="Close"
                  >
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
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </DialogClose>
              </DialogHeader>

              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold">Give your Comments</p>
                <textarea
                  placeholder="Enter your comment"
                  value={modalCommentValue}
                  onChange={(event) => {
                    setModalCommentValue(event.target.value);
                    if (modalCommentError) setModalCommentError("");
                  }}
                  className="h-28 w-full resize-none rounded-2xl border border-[#d1d5db] px-4 py-3 text-sm outline-none focus:border-[#0b8bd3] focus:ring-2 focus:ring-[#0b8bd3]/20"
                />
                {modalCommentError && (
                  <p className="text-xs text-[#f43f5e]">{modalCommentError}</p>
                )}
                <div className="flex justify-end sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handleSubmitComment(true)}
                    disabled={isModalSubmitting}
                    className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0b8bd3] text-sm font-semibold text-white disabled:opacity-80 sm:w-44"
                  >
                    {isModalSubmitting && (
                      <svg
                        className="h-4 w-4 animate-spin text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                        />
                      </svg>
                    )}
                    {isModalSubmitting ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>

              <div className="mt-6 max-h-[50vh] space-y-4 overflow-y-auto border-t border-[#e7e9ee] pt-5">
                {(comments ?? []).map((comment) => (
                  <div
                    key={`modal-${comment.id}`}
                    className="flex gap-3 border-b border-[#eef0f4] pb-4 last:border-b-0 last:pb-0"
                  >
                    <Link
                      href={`/profile/${comment.author.id}`}
                      className="h-9 w-9 overflow-hidden rounded-full bg-[#e5e7eb]"
                    >
                      <img
                        src={
                          comment.author.avatarUrl ||
                          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                        }
                        alt={comment.author.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        href={`/profile/${comment.author.id}`}
                        className="text-sm font-semibold"
                      >
                        {comment.author.name}
                      </Link>
                      <p className="text-xs text-[#6b7280]">
                        {formatDate(comment.createdAt)}
                      </p>
                      <p className="mt-2 text-sm text-[#4b5563]">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section className="mt-10 border-t border-[#eef0f4] pt-8">
        <h2 className="text-lg font-semibold">Another Post</h2>
        {anotherPost ? (
          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-[#e7e9ee] p-4 sm:flex-row">
            <Link href={`/detail/${anotherPost.id}`}>
              <img
                src={anotherPost.imageUrl || "/dummy-home-article.png"}
                alt={anotherPost.title}
                className="h-[140px] w-full rounded-xl object-cover sm:h-[120px] sm:w-[200px]"
              />
            </Link>
            <div className="flex-1 space-y-2">
              <Link href={`/detail/${anotherPost.id}`}>
                <h3 className="text-base font-semibold">{anotherPost.title}</h3>
              </Link>
              <div className="flex flex-wrap gap-2">
                {anotherPost.tags.map((tag) => (
                  <span
                    key={`another-${tag}`}
                    className="rounded-full border border-[#dfe3ea] px-3 py-1 text-xs text-[#4b5563]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-[#6b7280]">
                {stripHtml(anotherPost.content).slice(0, 120)}...
              </p>
              <div className="flex items-center gap-3 text-xs text-[#6b7280]">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 overflow-hidden rounded-full bg-[#e5e7eb]">
                    <img
                      src={author?.avatarUrl || "/dummy-home-article.png"}
                      alt={author?.name || post.author.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-[#111827]">
                    {author?.name || post.author.name}
                  </span>
                </div>
                <span>•</span>
                <span>{formatDate(anotherPost.createdAt)}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#6b7280]">
                <div className="flex items-center gap-2">
                  <img src="/like-icon.svg" alt="Likes" className="h-4 w-4" />
                  <span>{anotherPost.likes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/comment-icon.svg"
                    alt="Comments"
                    className="h-4 w-4"
                  />
                  <span>{anotherPost.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[#6b7280]">
            No other posts available.
          </p>
        )}
      </section>

      {showToast && (
        <Toast
          message={toastMessage}
          variant={toastVariant}
          position={toastVariant === "error" ? "top" : "center"}
        />
      )}
    </main>
  );
}
