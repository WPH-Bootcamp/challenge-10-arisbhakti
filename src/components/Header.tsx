export default function Header() {
  return (
    <header className="border-b border-[#e7e9ee] bg-white text-neutral-950">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src="/your-logo.svg"
            alt="Your Logo"
            className="w-5 h-[22px] md:w-[30px] md:h-[32px]"
          />
          <span className="text-base leading-6 font-bold md:text-2xl md:leading-9">
            Your Logo
          </span>
        </div>

        <div className="hidden w-full max-w-md items-center gap-3 rounded-full border border-[#e7e9ee] px-4 py-2 text-sm text-[#6b7280] sm:flex">
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
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <span>Search</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-4 text-sm sm:flex">
            <a href="/login" className="font-semibold text-[#0b8bd3]">
              Login
            </a>
            <a
              href="/register"
              className="rounded-full bg-[#0b8bd3] px-5 py-2 text-sm font-semibold text-white"
            >
              Register
            </a>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e7e9ee] text-[#111827] sm:hidden"
            aria-label="Open menu"
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
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
