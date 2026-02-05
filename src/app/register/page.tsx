"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { registerUser } from "@/lib/api";
import Toast from "@/components/Toast";

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorPulse, setErrorPulse] = useState(false);

  const hasErrors = useMemo(
    () => Object.values(errors).some(Boolean),
    [errors],
  );

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, [showToast]);

  const triggerErrorAnimation = () => {
    setErrorPulse(true);
    setTimeout(() => setErrorPulse(false), 450);
  };

  const validate = () => {
    const nextErrors: FieldErrors = {};

    if (!form.name.trim()) nextErrors.name = "Name is required";

    const emailValue = (form.email ?? "").toString().normalize("NFKC").trim();

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

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Confirm password is required";
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Password does not match";
    }

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitting", form);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      triggerErrorAnimation();
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setShowToast(true);
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      const nextErrors: FieldErrors = {};
      if (axios.isAxiosError(error)) {
        const apiErrors =
          error.response?.data?.details?.errors ??
          (error.response?.data?.message
            ? [error.response?.data?.message]
            : []);
        const message = apiErrors[0] ?? "Register failed";
        if (message.toLowerCase().includes("email")) {
          nextErrors.email = message;
        } else {
          nextErrors.general = message;
        }
      } else {
        nextErrors.general = "Register failed";
      }
      setErrors(nextErrors);
      triggerErrorAnimation();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[440px] rounded-2xl border border-[#e8eaf0] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        <div className="px-8 py-7">
          <h1 className="text-2xl font-semibold text-[#111827]">Sign Up</h1>
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#111827]">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, name: event.target.value }));
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                className={`h-12 w-full rounded-xl border px-4 text-sm outline-none transition focus:ring-2 ${
                  errors.name
                    ? `border-[#f43f5e] focus:border-[#f43f5e] focus:ring-[#f43f5e]/20 ${
                        errorPulse ? "shake" : ""
                      }`
                    : "border-[#d9dce3] focus:border-[#0b8bd3] focus:ring-[#0b8bd3]/20"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-[#f43f5e]">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#111827]">
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
                    : "border-[#d9dce3] focus:border-[#0b8bd3] focus:ring-[#0b8bd3]/20"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-[#f43f5e]">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#111827]">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
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
              {errors.password && (
                <p className="text-xs text-[#f43f5e]">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#111827]">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your confirm password"
                  value={form.confirmPassword}
                  onChange={(event) => {
                    setForm((prev) => ({
                      ...prev,
                      confirmPassword: event.target.value,
                    }));
                    if (errors.confirmPassword)
                      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                  className={`h-12 w-full rounded-xl border px-4 pr-12 text-sm outline-none transition focus:ring-2 ${
                    errors.confirmPassword
                      ? `border-[#f43f5e] focus:border-[#f43f5e] focus:ring-[#f43f5e]/20 ${
                          errorPulse ? "shake" : ""
                        }`
                      : "border-[#d9dce3] focus:border-[#0b8bd3] focus:ring-[#0b8bd3]/20"
                  }`}
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
              {errors.confirmPassword && (
                <p className="text-xs text-[#f43f5e]">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0b8bd3] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(11,139,211,0.25)] transition hover:bg-[#0a7bbd] ${
                isLoading ? "opacity-80" : ""
              }`}
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
              {isLoading ? "Loading..." : "Register"}
            </button>
            {errors.general && (
              <p className="text-center text-xs text-[#f43f5e]">
                {errors.general}
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-[#111827]">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-[#0b8bd3]">
              Log in
            </a>
          </p>
        </div>
      </div>

      {showToast && (
        <Toast
          message="Register successful, please login."
          variant="success"
          position="center"
        />
      )}
    </div>
  );
}
