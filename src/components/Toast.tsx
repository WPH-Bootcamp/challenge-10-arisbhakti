"use client";

type ToastProps = {
  message: string;
  variant?: "success" | "error";
  position?: "center" | "top";
};

export default function Toast({
  message,
  variant = "success",
  position = "center",
}: ToastProps) {
  const isError = variant === "error";
  const isTop = position === "top";
  return (
    <div
      className={`fixed z-50 pointer-events-none ${
        isTop
          ? "top-6 left-1/2 -translate-x-1/2"
          : "inset-0 flex items-center justify-center"
      }`}
    >
      <div
        className={`rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(11,139,211,0.35)] ${
          isError ? "bg-[#ef4444]" : "bg-[#0b8bd3]"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
