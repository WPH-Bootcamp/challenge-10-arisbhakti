export default function PostHeader({ title }: { title: string }) {
  return (
    <header className="border-b border-[#e7e9ee] bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3 text-[#111827]">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e7e9ee]"
            aria-label="Back"
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
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <span className="text-lg font-semibold">{title}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#111827]">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-[#e5e7eb]">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
              alt="John Doe"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-medium">John Doe</span>
        </div>
      </div>
    </header>
  );
}
