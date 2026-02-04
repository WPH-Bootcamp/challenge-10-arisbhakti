"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMeProfile,
  fetchPostComments,
  fetchPostLikes,
  fetchUserById,
  fetchUserByUsername,
} from "@/lib/tanstackQuery";
import { changePassword, deletePost, updateProfile } from "@/lib/api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [localProfileId, setLocalProfileId] = useState<number | null>(null);
  const isMe = paramId === "me" || (localProfileId && paramId === `${localProfileId}`);
  const numericId = Number(paramId);
  const [activeTab, setActiveTab] = useState<"posts" | "password">("posts");
  const [statsOpen, setStatsOpen] = useState(false);
  const [statsPostId, setStatsPostId] = useState<number | null>(null);
  const [statsTab, setStatsTab] = useState<"like" | "comment">("like");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    headline: "",
    avatarFile: null as File | null,
    avatarPreview: "",
  });
  const [editErrors, setEditErrors] = useState({
    name: "",
    headline: "",
    avatar: "",
  });
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<
    Partial<Record<keyof typeof passwordForm, string>>
  >({});
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
      const stored = localStorage.getItem("userProfile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as { id?: number };
          setLocalProfileId(parsed.id ?? null);
        } catch {
          setLocalProfileId(null);
        }
      }
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

  const {
    data: statsLikes,
    isLoading: isLikesLoading,
    isError: isLikesError,
  } = useQuery({
    queryKey: ["post-likes", statsPostId],
    queryFn: () => fetchPostLikes(statsPostId!),
    enabled: statsOpen && !!statsPostId,
  });

  const {
    data: statsComments,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
  } = useQuery({
    queryKey: ["post-comments", statsPostId],
    queryFn: () => fetchPostComments(statsPostId!),
    enabled: statsOpen && !!statsPostId,
  });

  const handleOpenStats = (postId: number) => {
    setStatsPostId(postId);
    setStatsTab("like");
    setStatsOpen(true);
  };

  const handleOpenDelete = (postId: number) => {
    setDeletePostId(postId);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletePostId) return;
    setIsDeleting(true);
    try {
      await deletePost(deletePostId);
      setToastMessage("Post deleted successfully.");
      setShowToast(true);
      setDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: ["profile-posts"] });
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage(
        error instanceof Error ? error.message : "Failed to delete post."
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenEdit = () => {
    setEditForm({
      name: profile.name || "",
      headline: headline || "",
      avatarFile: null,
      avatarPreview: avatarSrc,
    });
    setEditErrors({ name: "", headline: "", avatar: "" });
    setEditOpen(true);
  };

  const handleEditChange = (field: "name" | "headline", value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    if (editErrors[field]) {
      setEditErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleEditAvatar = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setEditErrors((prev) => ({
        ...prev,
        avatar: "Avatar must be an image file",
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setEditErrors((prev) => ({
        ...prev,
        avatar: "Avatar must be smaller than 5MB",
      }));
      return;
    }
    setEditForm((prev) => ({
      ...prev,
      avatarFile: file,
      avatarPreview: URL.createObjectURL(file),
    }));
    setEditErrors((prev) => ({ ...prev, avatar: "" }));
  };

  const validateEditProfile = () => {
    const nextErrors = { name: "", headline: "", avatar: "" };
    if (!editForm.name.trim()) {
      nextErrors.name = "Name is required";
    }
    if (!editForm.headline.trim()) {
      nextErrors.headline = "Headline is required";
    }
    if (!editForm.avatarFile) {
      nextErrors.avatar = "Avatar is required";
    }
    return nextErrors;
  };

  const handleSubmitEditProfile = async () => {
    const validation = validateEditProfile();
    if (validation.name || validation.headline || validation.avatar) {
      setEditErrors(validation);
      return;
    }
    if (!editForm.avatarFile) return;
    setIsEditSubmitting(true);
    try {
      const updated = await updateProfile({
        name: editForm.name.trim(),
        headline: editForm.headline.trim(),
        avatar: editForm.avatarFile,
      });
      localStorage.setItem("userProfile", JSON.stringify(updated));
      window.dispatchEvent(new Event("profile-updated"));
      queryClient.setQueryData(["profile", paramId], (prev: any) => ({
        ...(prev ?? {}),
        ...updated,
      }));
      queryClient.invalidateQueries({ queryKey: ["auth-user", updated.id] });
      setToastMessage("Profile updated successfully.");
      setShowToast(true);
      setEditOpen(false);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage(
        error instanceof Error ? error.message : "Failed to update profile."
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handlePasswordChange = (
    field: keyof typeof passwordForm,
    value: string
  ) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validatePasswordForm = () => {
    const nextErrors: Partial<Record<keyof typeof passwordForm, string>> = {};
    if (!passwordForm.currentPassword.trim()) {
      nextErrors.currentPassword = "Current password is required";
    }
    if (!passwordForm.newPassword.trim()) {
      nextErrors.newPassword = "New password is required";
    }
    if (!passwordForm.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Confirm password is required";
    }
    if (
      passwordForm.newPassword &&
      passwordForm.confirmPassword &&
      passwordForm.newPassword !== passwordForm.confirmPassword
    ) {
      nextErrors.confirmPassword = "Passwords do not match";
    }
    return nextErrors;
  };

  const handleSubmitPassword = async () => {
    const validation = validatePasswordForm();
    if (Object.keys(validation).length) {
      setPasswordErrors(validation);
      return;
    }
    setIsPasswordSubmitting(true);
    try {
      const response = await changePassword({
        currentPassword: passwordForm.currentPassword.trim(),
        newPassword: passwordForm.newPassword.trim(),
        confirmPassword: passwordForm.confirmPassword.trim(),
      });
      setToastMessage(response.message || "Password updated successfully");
      setShowToast(true);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage(
        error instanceof Error ? error.message : "Failed to update password."
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

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
              onClick={(event) => {
                event.preventDefault();
                handleOpenEdit();
              }}
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
                          onClick={(event) => {
                            event.preventDefault();
                            handleOpenStats(post.id);
                          }}
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
                          onClick={(event) => {
                            event.preventDefault();
                            handleOpenDelete(post.id);
                          }}
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
                    value={passwordForm.currentPassword}
                    onChange={(event) =>
                      handlePasswordChange("currentPassword", event.target.value)
                    }
                    className={`h-12 w-full rounded-xl border px-4 pr-11 text-sm outline-none transition focus:ring-2 ${
                      passwordErrors.currentPassword
                        ? "border-[#f43f5e] focus:border-[#f43f5e] focus:ring-[#f43f5e]/20"
                        : "border-[#d9dce3] focus:border-[#0b8bd3] focus:ring-[#0b8bd3]/20"
                    }`}
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
                {passwordErrors.currentPassword && (
                  <p className="text-xs text-[#f43f5e]">
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={passwordForm.newPassword}
                    onChange={(event) =>
                      handlePasswordChange("newPassword", event.target.value)
                    }
                    className={`h-12 w-full rounded-xl border px-4 pr-11 text-sm outline-none transition focus:ring-2 ${
                      passwordErrors.newPassword
                        ? "border-[#f43f5e] focus:border-[#f43f5e] focus:ring-[#f43f5e]/20"
                        : "border-[#d9dce3] focus:border-[#0b8bd3] focus:ring-[#0b8bd3]/20"
                    }`}
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
                {passwordErrors.newPassword && (
                  <p className="text-xs text-[#f43f5e]">
                    {passwordErrors.newPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={(event) =>
                      handlePasswordChange("confirmPassword", event.target.value)
                    }
                    className={`h-12 w-full rounded-xl border px-4 pr-11 text-sm outline-none transition focus:ring-2 ${
                      passwordErrors.confirmPassword
                        ? "border-[#f43f5e] focus:border-[#f43f5e] focus:ring-[#f43f5e]/20"
                        : "border-[#d9dce3] focus:border-[#0b8bd3] focus:ring-[#0b8bd3]/20"
                    }`}
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
                {passwordErrors.confirmPassword && (
                  <p className="text-xs text-[#f43f5e]">
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSubmitPassword}
                disabled={isPasswordSubmitting}
                className="h-12 w-full rounded-full bg-[#0b8bd3] text-sm font-semibold text-white disabled:opacity-70"
              >
                {isPasswordSubmitting ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        )}
      </div>

      <Dialog open={statsOpen} onOpenChange={setStatsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Statistic</DialogTitle>
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

          <div className="mt-4">
            <div className="relative flex items-center border-b border-[#e7e9ee] text-sm">
              <div className="flex w-full">
                <button
                  type="button"
                  onClick={() => setStatsTab("like")}
                  className={`flex flex-1 items-center justify-center gap-2 py-3 font-semibold transition-colors ${
                    statsTab === "like"
                      ? "text-primary-300"
                      : "text-neutral-950"
                  }`}
                >
                  <img
                    src={statsTab === "like" ? "/liked-icon.svg" : "/like-icon.svg"}
                    alt="Like"
                    className="h-4 w-4"
                  />
                  Like
                </button>
                <button
                  type="button"
                  onClick={() => setStatsTab("comment")}
                  className={`flex flex-1 items-center justify-center gap-2 py-3 font-semibold transition-colors ${
                    statsTab === "comment"
                      ? "text-primary-300"
                      : "text-neutral-950"
                  }`}
                >
                  <img
                    src={
                      statsTab === "comment"
                        ? "/comment-tab-selected.svg"
                        : "/comment-tab.svg"
                    }
                    alt="Comment"
                    className="h-4 w-4"
                  />
                  Comment
                </button>
              </div>
              <span
                className={`absolute bottom-0 left-0 h-[2px] w-1/2 bg-primary-300 transition-transform duration-300 ${
                  statsTab === "comment" ? "translate-x-full" : "translate-x-0"
                }`}
              />
            </div>

            <div className="mt-5">
              {statsTab === "like" ? (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold">
                    Like ({statsLikes?.length ?? 0})
                  </h3>
                  {isLikesLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, index) => (
                        <div
                          key={`like-loading-${index}`}
                          className="h-14 rounded-xl bg-[#eef0f4] animate-pulse"
                        />
                      ))}
                    </div>
                  ) : isLikesError ? (
                    <div className="rounded-xl border border-[#fca5a5] bg-[#fee2e2] px-4 py-3 text-sm text-[#b91c1c]">
                      Failed to load likes.
                    </div>
                  ) : statsLikes && statsLikes.length > 0 ? (
                    <div className="space-y-4">
                      {statsLikes.map((user) => (
                        <div
                          key={`like-${user.id}`}
                          className="flex items-center gap-3 border-b border-[#eef0f4] pb-4 last:border-b-0 last:pb-0"
                        >
                          <div className="h-10 w-10 overflow-hidden rounded-full bg-[#e5e7eb]">
                            <img
                              src={
                                user.avatarUrl ||
                                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                              }
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{user.name}</p>
                            <p className="text-xs text-[#6b7280]">
                              {user.headline || "Frontend Developer"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#6b7280]">
                      No likes yet.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold">
                    Comment ({statsComments?.length ?? 0})
                  </h3>
                  {isCommentsLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, index) => (
                        <div
                          key={`comment-loading-${index}`}
                          className="h-20 rounded-xl bg-[#eef0f4] animate-pulse"
                        />
                      ))}
                    </div>
                  ) : isCommentsError ? (
                    <div className="rounded-xl border border-[#fca5a5] bg-[#fee2e2] px-4 py-3 text-sm text-[#b91c1c]">
                      Failed to load comments.
                    </div>
                  ) : statsComments && statsComments.length > 0 ? (
                    <div className="space-y-4">
                      {statsComments.map((comment) => (
                        <div
                          key={`comment-${comment.id}`}
                          className="flex gap-3 border-b border-[#eef0f4] pb-4 last:border-b-0 last:pb-0"
                        >
                          <div className="h-10 w-10 overflow-hidden rounded-full bg-[#e5e7eb]">
                            <img
                              src={
                                comment.author.avatarUrl ||
                                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                              }
                              alt={comment.author.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold">
                              {comment.author.name}
                            </p>
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
                  ) : (
                    <p className="text-sm text-[#6b7280]">
                      No comments yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete</DialogTitle>
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

          <div className="mt-3">
            <p className="text-sm text-[#6b7280]">
              Are you sure to delete?
            </p>
            <div className="mt-6 flex items-center justify-end gap-4">
              <button
                type="button"
                className="text-sm font-semibold text-[#111827]"
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex h-11 items-center justify-center rounded-full bg-[#f43f5e] px-7 text-sm font-semibold text-white disabled:opacity-70"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
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

          <div className="mt-4 space-y-4">
            <div className="flex justify-center">
              <label className="group relative cursor-pointer">
                <div className="h-20 w-20 overflow-hidden rounded-full bg-[#e5e7eb]">
                  <img
                    src={editForm.avatarPreview || avatarSrc}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#0b8bd3] text-white">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 7h2l2-2h6l2 2h2v12H5z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(event) =>
                    handleEditAvatar(event.target.files?.[0])
                  }
                />
              </label>
            </div>
            {editErrors.avatar && (
              <p className="text-center text-xs text-[#f43f5e]">
                {editErrors.avatar}
              </p>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(event) =>
                  handleEditChange("name", event.target.value)
                }
                className={`h-12 w-full rounded-xl border px-4 text-sm outline-none transition focus:ring-2 ${
                  editErrors.name
                    ? "border-[#f43f5e] focus:border-[#f43f5e] focus:ring-[#f43f5e]/20"
                    : "border-[#d9dce3] focus:border-[#0b8bd3] focus:ring-[#0b8bd3]/20"
                }`}
              />
              {editErrors.name && (
                <p className="text-xs text-[#f43f5e]">{editErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Profile Headline</label>
              <input
                type="text"
                value={editForm.headline}
                onChange={(event) =>
                  handleEditChange("headline", event.target.value)
                }
                className={`h-12 w-full rounded-xl border px-4 text-sm outline-none transition focus:ring-2 ${
                  editErrors.headline
                    ? "border-[#f43f5e] focus:border-[#f43f5e] focus:ring-[#f43f5e]/20"
                    : "border-[#d9dce3] focus:border-[#0b8bd3] focus:ring-[#0b8bd3]/20"
                }`}
              />
              {editErrors.headline && (
                <p className="text-xs text-[#f43f5e]">
                  {editErrors.headline}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmitEditProfile}
              disabled={isEditSubmitting}
              className="h-12 w-full rounded-full bg-[#0b8bd3] text-sm font-semibold text-white disabled:opacity-70"
            >
              {isEditSubmitting ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-full bg-[#111827] px-5 py-3 text-sm text-white shadow-lg">
          {toastMessage}
        </div>
      )}
    </main>
  );
}
