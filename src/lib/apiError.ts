"use client";

import axios from "axios";

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong."
) {
  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string })?.message || fallback;
    return message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
