"use client";

import { QueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export type RecommendedPost = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  createdAt: string;
  likes: number;
  comments: number;
  author: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
};

export type RecommendedResponse = {
  data: RecommendedPost[];
  total: number;
  page: number;
  lastPage: number;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 30,
    },
  },
});

export async function fetchRecommendedPosts(page: number, limit = 5) {
  const response = await apiClient.get<RecommendedResponse>(
    `/posts/recommended?limit=${limit}&page=${page}`
  );
  return response.data;
}

export async function fetchMostLikedPosts(page = 1, limit = 3) {
  const response = await apiClient.get<RecommendedResponse>(
    `/posts/most-liked?limit=${limit}&page=${page}`
  );
  return response.data;
}
