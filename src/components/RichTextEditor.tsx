"use client";

import { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";

type RichTextEditorProps = {
  initialContent?: string;
  error?: boolean;
  onChange?: (value: string) => void;
};

const toolbarOptions = [
  [{ header: [1, 2, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  ["link", "image"],
  ["clean"],
];

export default function RichTextEditor({
  initialContent,
  error = false,
  onChange,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<any>(null);
  const lastContentRef = useRef<string | undefined>(undefined);
  const didEditRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (!editorRef.current || !toolbarRef.current || quillRef.current) {
        return;
      }

      const Quill = (await import("quill")).default;

      if (cancelled) return;

      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Enter your content",
        modules: {
          toolbar: toolbarRef.current,
        },
      });

      if (initialContent) {
        quillRef.current.clipboard.dangerouslyPasteHTML(initialContent);
        lastContentRef.current = initialContent;
      }

      quillRef.current.on("text-change", () => {
        didEditRef.current = true;
        if (onChange) {
          onChange(quillRef.current.root.innerHTML);
        }
      });
    };

    init();

    return () => {
      cancelled = true;
      quillRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!quillRef.current) return;
    if (initialContent === undefined) return;
    if (didEditRef.current) return;
    if (initialContent === lastContentRef.current) return;
    quillRef.current.clipboard.dangerouslyPasteHTML(initialContent);
    lastContentRef.current = initialContent;
  }, [initialContent]);

  return (
    <div
      className={`quill-wrapper overflow-hidden rounded-xl border ${
        error
          ? "border-[#f43f5e]"
          : "border-[#d9dce3] focus-within:border-[#0b8bd3] focus-within:ring-2 focus-within:ring-[#0b8bd3]/20"
      }`}
    >
      <div ref={toolbarRef} className="ql-toolbar ql-snow">
        <span className="ql-formats">
          <select className="ql-header" defaultValue="">
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="">Paragraph</option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-strike" />
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
        </span>
        <span className="ql-formats">
          <button className="ql-align" value="" />
          <button className="ql-align" value="center" />
          <button className="ql-align" value="right" />
        </span>
        <span className="ql-formats">
          <button className="ql-link" />
          <button className="ql-image" />
        </span>
        <span className="ql-formats">
          <button className="ql-clean" />
        </span>
      </div>
      <div ref={editorRef} className="min-h-[180px]" />
    </div>
  );
}
