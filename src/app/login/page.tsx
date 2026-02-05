"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import axios from "axios";
import { loginUser } from "@/lib/api";
import { fetchMeProfile } from "@/lib/tanstackQuery";

type FieldErrors = {
  email?: string;
  password?: string;
  general?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorPulse, setErrorPulse] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasErrors = useMemo(
    () => Object.values(errors).some(Boolean),
    [errors],
  );

  const triggerErrorAnimation = () => {
    setErrorPulse(true);
    setTimeout(() => setErrorPulse(false), 450);
  };

  const validate = () => {
    const nextErrors: FieldErrors = {};
    const emailValue = form.email.trim();
    if (!emailValue) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      nextErrors.email = "Email is invalid";
    }

    if (!form.password) {
      nextErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }
    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      triggerErrorAnimation();
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      const response = await loginUser({
        email: form.email.trim(),
        password: form.password,
      });
      localStorage.setItem("token", response.token);
      try {
        const profile = await fetchMeProfile(response.token);
        localStorage.setItem("userProfile", JSON.stringify(profile));
        window.dispatchEvent(new Event("profile-updated"));
      } catch {
        // Ignore profile fetch errors on login
      }
      router.push("/");
    } catch (error) {
      const nextErrors: FieldErrors = {};
      if (axios.isAxiosError(error)) {
        const apiErrors =
          error.response?.data?.details?.errors ??
          (error.response?.data?.message
            ? [error.response?.data?.message]
            : []);
        const message = apiErrors[0] ?? "Login failed";
        if (message.toLowerCase().includes("email")) {
          nextErrors.email = message;
        } else if (message.toLowerCase().includes("password")) {
          nextErrors.password = message;
        } else {
          nextErrors.general = message;
        }
      } else {
        nextErrors.general = "Login failed";
      }
      setErrors(nextErrors);
      triggerErrorAnimation();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center px-4 py-10 text-neutral-900">
      <div className="w-full md:max-w-[400px] rounded-2xl border border-[#e8eaf0] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        <div className="px-6 py-6 flex flex-col gap-5">
          <h1 className="text-xl leading-8.5 -tracking-[0.03em] font-bold ">
            Sign In
          </h1>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-sm leading-7 font-semibold text-[#111827]">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, email: event.target.value }));
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: "" }));
                }}
                className={`h-12 w-full rounded-xl border px-4 text-sm outline-none transition focus:ring-2 ${
                  errors.email
                    ? `border-[#f43f5e] focus:border-[#f43f5e] focus:ring-[#f43f5e]/20 ${
                        errorPulse ? "shake" : ""
                      }`
                    : "border-[#d9dce3] focus:border-primary-300 focus:ring-primary-300/20"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-[#f43f5e]">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm leading-7 font-semibold text-[#111827]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(event) => {
                    setForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }));
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  className={`h-12 w-full rounded-xl border px-4 pr-12 text-sm outline-none transition focus:ring-2 ${
                    errors.password
                      ? `border-[#f43f5e] focus:border-[#f43f5e] focus:ring-[#f43f5e]/20 ${
                          errorPulse ? "shake" : ""
                        }`
                      : "border-[#d9dce3] focus:border-[#0b8bd3] focus:ring-[#0b8bd3]/20"
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0f172a] cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
                    <path d="M2.46 12s3.74-7 9.54-7 9.54 7 9.54 7-3.74 7-9.54 7-9.54-7-9.54-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[#f43f5e]">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0b8bd3] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(11,139,211,0.25)] transition hover:bg-[#0a7bbd] ${
                isLoading ? "opacity-80" : ""
              } cursor-pointer`}
            >
              {isLoading && (
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                  />
                </svg>
              )}
              {isLoading ? "Loading..." : "Login"}
            </button>
            {errors.general && (
              <p className="text-center text-xs text-[#f43f5e]">
                {errors.general}
              </p>
            )}
          </form>

          <p className="text-center text-sm text-[#111827]">
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
