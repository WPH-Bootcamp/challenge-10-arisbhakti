/**
 * API Utility
 *
 * Helper functions untuk fetch data dari backend API
 * Kamu bisa modify atau extend sesuai kebutuhan
 */

import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
});

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  id: number;
  email: string;
  username: string;
};

export async function registerUser(payload: RegisterPayload) {
  const response = await apiClient.post<RegisterResponse>(
    "/auth/register",
    payload
  );
  return response.data;
}

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export async function loginUser(payload: LoginPayload) {
  const response = await apiClient.post<LoginResponse>("/auth/login", payload);
  return response.data;
}

export type CreateCommentPayload = {
  content: string;
};

export type CreateCommentResponse = {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
    email: string;
    username: string;
    headline?: string | null;
    avatarUrl?: string | null;
    avatarPublicId?: string | null;
  };
  post: {
    id: number;
    title: string;
  };
};

export async function createComment(postId: number, payload: CreateCommentPayload) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication required");
  }
  const response = await apiClient.post<CreateCommentResponse>(
    `/comments/${postId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
