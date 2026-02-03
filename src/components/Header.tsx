"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <img src="/search-icon.png" alt="Search" className="h-4 w-4" />
          <span>Search</span>
        </div>

        <div className="flex items-center gap-4">
          {!isLogin && (
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
          )}

          {isLogin && (
            <div className="hidden items-center gap-4 sm:flex">
              <button className="flex items-center gap-2 text-sm font-semibold text-primary-300">
                <img
                  src="/write-post-icon.svg"
                  alt="Write Post"
                  className="h-4 w-4"
                />
                Write Post
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                      alt="John Doe"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <span className="text-sm font-semibold">John Doe</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <img
                      src="/profile-icon.svg"
                      alt="Profile"
                      className="h-4 w-4"
                    />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setIsLogin(false)}>
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
                aria-label="Open menu"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <img src="/humberger-icon.png" alt="Menu" className="h-5 w-5" />
              </button>
            </div>
          )}

          {isLogin && (
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                      alt="John Doe"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <img
                      src="/profile-icon.svg"
                      alt="Profile"
                      className="h-4 w-4"
                    />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setIsLogin(false)}>
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

      {isMobileMenuOpen && !isLogin && (
        <div className="fixed inset-0 z-50 bg-white px-6 py-6 sm:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/your-logo.svg"
                alt="Your Logo"
                className="w-5 h-[22px]"
              />
              <span className="text-base font-bold">Your Logo</span>
            </div>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl"
            >
              ×
            </button>
          </div>

          <div className="mt-16 flex flex-col items-center gap-6">
            <a href="/login" className="text-base font-semibold text-[#0b8bd3]">
              Login
            </a>
            <a
              href="/register"
              className="w-full max-w-[220px] rounded-full bg-[#0b8bd3] px-6 py-3 text-center text-sm font-semibold text-white"
            >
              Register
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
