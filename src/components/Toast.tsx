"use client";

type ToastProps = {
  message: string;
};

export default function Toast({ message }: ToastProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pointer-events-none mt-10">
      <div className="rounded-2xl bg-[#0b8bd3] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(11,139,211,0.35)]">
        {message}
      </div>
    </div>
  );
}
