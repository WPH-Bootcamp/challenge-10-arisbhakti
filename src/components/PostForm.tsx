"use client";

import { useMemo, useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";

const suggestions = ["Programming", "Frontend", "Coding", "Design", "UI UX"];

type PostFormProps = {
  mode: "write" | "edit";
};

export default function PostForm({ mode }: PostFormProps) {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(
    mode === "edit" ? ["Programming", "Frontend", "Coding"] : []
  );

  const filteredSuggestions = useMemo(() => {
    const query = tagInput.trim().toLowerCase();
    if (!query) return [];
    return suggestions.filter(
      (item) =>
        item.toLowerCase().includes(query) && !tags.includes(item)
    );
  }, [tagInput, tags]);

  const addTag = (value: string) => {
    const cleaned = value.trim();
    if (!cleaned || tags.includes(cleaned)) return;
    setTags((prev) => [...prev, cleaned]);
    setTagInput("");
  };

  const removeTag = (value: string) => {
    setTags((prev) => prev.filter((tag) => tag !== value));
  };

  const showErrors = false;

  return (
    <form className="mx-auto w-full max-w-2xl space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold">Title</label>
        <input
          type="text"
          placeholder="Enter your title"
          defaultValue={
            mode === "edit"
              ? "5 Reasons to Learn Frontend Development in 2025"
              : ""
          }
          className={`h-12 w-full rounded-xl border px-4 text-sm outline-none transition ${
            showErrors
              ? "border-[#f43f5e] focus:border-[#f43f5e] focus:ring-2 focus:ring-[#f43f5e]/20"
              : "border-[#d9dce3] focus:border-[#0b8bd3] focus:ring-2 focus:ring-[#0b8bd3]/20"
          }`}
        />
        {showErrors && (
          <p className="text-xs text-[#f43f5e]">Error Text Helper</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Content</label>
        <RichTextEditor
          error={showErrors}
          initialContent={
            mode === "edit"
              ? "<ul><li>Lorem ipsum dolor sit amet consectetur.</li><li>Lorem ipsum dolor sit amet consectetur.</li><li>Lorem ipsum dolor sit amet consectetur.</li><li>Lorem ipsum dolor sit amet consectetur.</li></ul>"
              : undefined
          }
        />
        {showErrors && (
          <p className="text-xs text-[#f43f5e]">Error Text Helper</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Cover Image</label>
        <div
          className={`rounded-2xl border border-dashed px-6 py-8 text-center ${
            showErrors ? "border-[#f43f5e]" : "border-[#cbd5f5]"
          }`}
        >
          {mode === "edit" ? (
            <div className="space-y-4">
              <div className="mx-auto w-full max-w-md overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80"
                  alt="Cover"
                  className="h-48 w-full object-cover"
                />
              </div>
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <button
                  type="button"
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
                <span className="font-semibold text-[#0b8bd3]">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs">PNG or JPG (max. 5mb)</p>
            </div>
          )}
        </div>
        {showErrors && (
          <p className="text-xs text-[#f43f5e]">Error Text Helper</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Tags</label>
        <div
          className={`rounded-xl border px-4 py-2 ${
            showErrors
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
                  const nextTag =
                    filteredSuggestions[0] ?? tagInput.trim();
                  addTag(nextTag);
                }
              }}
              placeholder={tags.length ? "" : "Enter your tags"}
              className="min-w-[140px] flex-1 py-2 text-sm outline-none"
            />
          </div>
        </div>
        {showErrors && (
          <p className="text-xs text-[#f43f5e]">Error Text Helper</p>
        )}
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
          type="button"
          className="h-12 w-44 rounded-full bg-[#0b8bd3] text-sm font-semibold text-white"
        >
          Finish
        </button>
      </div>
    </form>
  );
}
