"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import { createPost, updatePost } from "@/lib/api";

const suggestions = ["Programming", "Frontend", "Coding", "Design", "UI UX"];

type PostFormProps = {
  mode: "write" | "edit";
  postId?: number;
  initialData?: {
    title: string;
    content: string;
    tags: string[];
    imageUrl?: string | null;
  };
};

export default function PostForm({ mode, postId, initialData }: PostFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(
    mode === "edit" ? ["Programming", "Frontend", "Coding"] : [],
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editorInitial, setEditorInitial] = useState<string | undefined>(
    undefined,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const hydratedRef = useRef<number | null>(null);

  useEffect(() => {
    if (!initialData) return;
    if (mode === "edit" && postId && hydratedRef.current === postId) return;
    setTitle(initialData.title ?? "");
    setContent(initialData.content ?? "");
    setEditorInitial(initialData.content ?? "");
    setTags(initialData.tags ?? []);
    if (initialData.imageUrl) {
      setImagePreview(initialData.imageUrl);
    }
    if (mode === "edit" && postId) hydratedRef.current = postId;
  }, [initialData, mode, postId]);

  const filteredSuggestions = useMemo(() => {
    const query = tagInput.trim().toLowerCase();
    if (!query) return [];
    return suggestions.filter(
      (item) => item.toLowerCase().includes(query) && !tags.includes(item),
    );
  }, [tagInput, tags]);

  const addTag = (value: string) => {
    const cleaned = value.trim();
    if (!cleaned || tags.includes(cleaned)) return;
    setTags((prev) => [...prev, cleaned]);
    setTagInput("");
    setErrors((prev) => ({ ...prev, tags: "" }));
  };

  const removeTag = (value: string) => {
    setTags((prev) => prev.filter((tag) => tag !== value));
  };

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (file?: File | null) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveImage(false);
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleRemoveImage = () => {
    if (imagePreview && imageFile) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setImageFile(null);
    setRemoveImage(true);
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = "Title is required";
    if (!content || content === "<p><br></p>") {
      nextErrors.content = "Content is required";
    }
    if (!tags.length) nextErrors.tags = "At least one tag is required";
    if (mode === "write" && !imageFile) {
      nextErrors.image = "Cover image is required";
    }
    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log("Submitting form...");
    event.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }
    console.log("Submitting form 2nd Phase...");
    if (mode === "write" && !imageFile) return;
    setIsSubmitting(true);
    setErrors({});
    console.log("Submitting form 3rd Phase...");
    try {
      if (mode === "edit" && postId) {
        await updatePost(postId, {
          title: title.trim(),
          content,
          tags,
          image: imageFile ?? null,
          removeImage: removeImage ? true : imageFile ? false : undefined,
        });
        setToastMessage("Post updated successfully.");
      } else {
        await createPost({
          title: title.trim(),
          content,
          tags,
          image: imageFile!,
        });
        setToastMessage("Post uploaded successfully.");
        setTitle("");
        setContent("");
        setEditorInitial("");
        setTags([]);
        setTagInput("");
        handleRemoveImage();
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setErrors({
        general:
          mode === "edit" ? "Failed to update post" : "Failed to upload post",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="mx-auto w-full max-w-2xl space-y-6"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <label className="text-sm font-semibold">Title</label>
        <input
          type="text"
          placeholder="Enter your title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
          }}
          className={`h-12 w-full rounded-xl border px-4 text-sm outline-none transition focus:ring-2 ${
            errors.title
              ? "border-[#f43f5e] focus:border-[#f43f5e] focus:ring-[#f43f5e]/20"
              : "border-[#d9dce3] focus:border-[#0b8bd3] focus:ring-[#0b8bd3]/20"
          }`}
        />
        {errors.title && (
          <p className="text-xs text-[#f43f5e]">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Content</label>
        <RichTextEditor
          error={!!errors.content}
          initialContent={editorInitial}
          onChange={(value) => {
            setContent(value);
            if (errors.content) setErrors((prev) => ({ ...prev, content: "" }));
          }}
        />
        {errors.content && (
          <p className="text-xs text-[#f43f5e]">{errors.content}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Cover Image</label>
        <div
          className={`rounded-2xl border border-dashed px-6 py-8 text-center ${
            errors.image ? "border-[#f43f5e]" : "border-[#cbd5f5]"
          }`}
        >
          {imagePreview ? (
            <div className="space-y-4">
              <div className="mx-auto w-full max-w-md overflow-hidden rounded-xl">
                <img
                  src={imagePreview}
                  alt="Cover"
                  className="h-48 w-full object-cover"
                />
              </div>
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <button
                  type="button"
                  onClick={handlePickImage}
                  className="flex items-center gap-2 rounded-full border border-[#e7e9ee] px-4 py-2"
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="flex items-center gap-2 rounded-full border border-[#fecdd3] px-4 py-2 text-[#f43f5e]"
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
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                  Delete Image
                </button>
              </div>
              <p className="text-xs text-[#6b7280]">PNG or JPG (max. 5mb)</p>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-[#6b7280]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#e5e7eb] text-[#111827]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p>
                <button
                  type="button"
                  onClick={handlePickImage}
                  className="font-semibold text-[#0b8bd3]"
                >
                  Click to upload
                </button>{" "}
                or drag and drop
              </p>
              <p className="text-xs">PNG or JPG (max. 5mb)</p>
            </div>
          )}
        </div>
        {errors.image && (
          <p className="text-xs text-[#f43f5e]">{errors.image}</p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) =>
            handleImageChange(event.target.files?.[0] ?? null)
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Tags</label>
        <div
          className={`rounded-xl border px-4 py-2 ${
            errors.tags
              ? "border-[#f43f5e]"
              : "border-[#d9dce3] focus-within:border-[#0b8bd3] focus-within:ring-2 focus-within:ring-[#0b8bd3]/20"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-2 rounded-full border border-[#dfe3ea] px-3 py-1 text-xs text-[#4b5563]"
              >
                {tag}
                <button
                  type="button"
                  className="text-[#6b7280]"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  const nextTag = filteredSuggestions[0] ?? tagInput.trim();
                  addTag(nextTag);
                }
              }}
              placeholder={tags.length ? "" : "Enter your tags"}
              className="min-w-35 flex-1 py-2 text-sm outline-none"
            />
          </div>
        </div>
        {errors.tags && <p className="text-xs text-[#f43f5e]">{errors.tags}</p>}
        {filteredSuggestions.length > 0 && (
          <div className="rounded-xl border border-[#e7e9ee] bg-white p-2 shadow-sm">
            {filteredSuggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => addTag(item)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f3f4f6]"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-44 rounded-full bg-[#0b8bd3] text-sm font-semibold text-white disabled:opacity-80"
        >
          {isSubmitting
            ? mode === "edit"
              ? "Updating..."
              : "Uploading..."
            : "Finish"}
        </button>
      </div>
      {errors.general && (
        <p className="text-center text-xs text-[#f43f5e]">{errors.general}</p>
      )}
      {showToast && (
        <div className="fixed right-6 top-6 z-50 rounded-2xl bg-[#0b8bd3] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(11,139,211,0.35)]">
          {toastMessage}
        </div>
      )}
    </form>
  );
}
