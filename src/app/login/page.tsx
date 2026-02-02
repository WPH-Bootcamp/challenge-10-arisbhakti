export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px] rounded-2xl border border-[#e8eaf0] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        <div className="px-8 py-7">
          <h1 className="text-2xl font-semibold text-[#111827]">Sign In</h1>
          <form className="mt-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#111827]">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="h-12 w-full rounded-xl border border-[#d9dce3] px-4 text-sm outline-none transition focus:border-[#0b8bd3] focus:ring-2 focus:ring-[#0b8bd3]/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#111827]">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-xl border border-[#d9dce3] px-4 pr-12 text-sm outline-none transition focus:border-[#0b8bd3] focus:ring-2 focus:ring-[#0b8bd3]/20"
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
              className="h-12 w-full rounded-full bg-[#0b8bd3] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(11,139,211,0.25)] transition hover:bg-[#0a7bbd]"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#111827]">
            Don&apos;t have an account?{" "}
            <a href="/register" className="font-semibold text-[#0b8bd3]">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
