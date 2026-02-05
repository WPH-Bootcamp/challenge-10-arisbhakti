"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchUserById } from "@/lib/tanstackQuery";
import { getAuthPayload } from "@/lib/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const [userLabel, setUserLabel] = useState("User");
  const [userId, setUserId] = useState<number | null>(null);
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const readAuth = () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLogin(false);
      setUserLabel("User");
      setUserId(null);
      setProfileAvatar(null);
      return;
    }
    setIsLogin(true);
    const payload = getAuthPayload(token);
    const email = payload?.email ?? "";
    const nameFromEmail = email ? email.split("@")[0] : "User";
    setUserLabel(payload?.username || payload?.name || nameFromEmail || "User");
    setUserId(payload?.id ?? null);

    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile) as {
          name?: string;
          username?: string;
          avatarUrl?: string;
        };
        setUserLabel(
          parsed?.name ||
            parsed?.username ||
            payload?.username ||
            nameFromEmail,
        );
        setProfileAvatar(parsed?.avatarUrl || null);
      } catch {
        setProfileAvatar(null);
      }
    }
  };

  useEffect(() => {
    readAuth();
    const handleStorage = () => readAuth();
    const handleProfileUpdated = () => readAuth();
    const storedSearch = localStorage.getItem("searchQuery") || "";
    setSearchValue(storedSearch);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("profile-updated", handleProfileUpdated);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("profile-updated", handleProfileUpdated);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    setIsLogin(false);
    setUserLabel("User");
    setUserId(null);
    setProfileAvatar(null);
    window.dispatchEvent(new Event("profile-updated"));
    router.push("/login");
  };

  const avatarAlt = useMemo(() => userLabel || "User", [userLabel]);

  const { data: currentUser } = useQuery({
    queryKey: ["auth-user", userId],
    queryFn: () => fetchUserById(userId!),
    enabled: !!userId && !profileAvatar,
  });

  return (
    <header className="sticky top-0 left-0 z-50 w-full border-b border-[#e7e9ee] bg-white text-neutral-950 h-16 md:h-20 flex items-center shadow-sm">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 py-0 md:px-0">
        <Link href="/">
          <div id="logo-div" className="flex items-center gap-3">
            <img
              src="/your-logo.svg"
              alt="Your Logo"
              className="w-5 h-[22px] md:w-[30px] md:h-[32px]"
            />
            <span className="text-base leading-6 font-semibold md:text-2xl md:leading-9">
              Your Logo
            </span>
          </div>
        </Link>

        <div className="hidden  w-[377px] items-center gap-3 rounded-2xl border border-[#e7e9ee] px-4 py-2 text-sm text-[#6b7280] sm:flex h-12">
          <img src="/search-input.svg" alt="Search" className="h-6 w-6" />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => {
              const value = event.target.value;
              setSearchValue(value);
              localStorage.setItem("searchQuery", value);
              window.dispatchEvent(new Event("search-updated"));
              if (pathname !== "/") router.push("/");
            }}
            placeholder="Search"
            className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-6">
          {!isLogin && (
            <div className="hidden items-center gap-6 text-sm sm:flex">
              <a
                href="/login"
                className="text-sm font-semibold text-primary-300 leading-7 -tracking-[0.03em] underline underline-offset-4"
              >
                Login
              </a>
              <span className="text-neutral-300">|</span>
              <a
                href="/register"
                className="rounded-full bg-primary-300 px-5 text-sm font-semibold text-white leading-7 -tracking-[0.03em] h-11 w-45.5 flex items-center justify-center"
              >
                Register
              </a>
            </div>
          )}

          {isLogin && (
            <div className="hidden items-center gap-6 sm:flex">
              <button
                className="flex items-center gap-2 text-sm font-semibold text-primary-300 cursor-pointer"
                onClick={() => router.push("/post")}
              >
                <img
                  src="/write-post-icon.svg"
                  alt="Write Post"
                  className="h-6 w-6"
                />
                <span className="text-sm leading-7 -tracking-[0.03em] font-semibold underline underline-offset-4">
                  Write Post
                </span>
              </button>
              <span className="text-neutral-300">|</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 cursor-pointer">
                    <img
                      src={
                        profileAvatar ||
                        currentUser?.avatarUrl ||
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                      }
                      alt={avatarAlt}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium leading-7 -tracking-[0.03em]">
                      {userLabel}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => router.push("/profile/me")}>
                    <img
                      src="/profile-icon.svg"
                      alt="Profile"
                      className="h-4 w-4"
                    />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleLogout}>
                    <img
                      src="/logout-icon.svg"
                      alt="Logout"
                      className="h-4 w-4"
                    />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {!isLogin && (
            <div className="flex items-center gap-3 sm:hidden">
              <img src="/search-icon.png" alt="Search" className="h-5 w-5" />
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center text-[#111827]"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              >
                {isMobileMenuOpen ? (
                  <span className="text-xl leading-none">×</span>
                ) : (
                  <img
                    src="/humberger-icon.png"
                    alt="Menu"
                    className="h-5 w-5"
                  />
                )}
              </button>
            </div>
          )}

          {isLogin && (
            <div className="flex items-center gap-3 sm:hidden">
              <img src="/search-icon.png" alt="Search" className="h-5 w-5" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2">
                    <img
                      src={
                        profileAvatar ||
                        currentUser?.avatarUrl ||
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                      }
                      alt={avatarAlt}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => router.push("/profile/me")}>
                    <img
                      src="/profile-icon.svg"
                      alt="Profile"
                      className="h-4 w-4"
                    />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleLogout}>
                    <img
                      src="/logout-icon.svg"
                      alt="Logout"
                      className="h-4 w-4"
                    />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      {!isLogin && (
        <div
          className={`absolute left-0 right-0 top-full z-40 bg-white px-6 py-10 transition-all duration-200 sm:hidden ${
            isMobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0 pointer-events-none"
          }`}
          style={{ height: "calc(100vh - 72px)" }}
        >
          <div className="flex flex-col items-center gap-6">
            <a
              href="/login"
              className="text-sm font-semibold text-primary-300 leading-7 -tracking-[0.03em] underline underline-offset-4"
            >
              Login
            </a>
            <a
              href="/register"
              className="w-full max-w-[220px] rounded-full bg-primary-300 px-6 py-3 text-center text-sm font-semibold text-white"
            >
              Register
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
