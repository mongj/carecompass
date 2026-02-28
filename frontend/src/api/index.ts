import { GetReviewsParams } from "@/types/api";
import { Review } from "@/types/review";

const baseUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL;
let getToken: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (fn: (() => Promise<string | null>) | null) => {
  getToken = fn;
};

export const HTTP_OK = 200;
export const HTTP_CREATED = 201;
export const HTTP_BAD_REQUEST = 400;

/** Response shape for successful api.get/post/patch/put/delete (throws on non-2xx). */
export type ApiResponse<T = unknown> = {
  data: T | undefined;
  status: number;
};

/** Thrown when the server returns a non-2xx status. Check status for 404, 400, etc. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function buildHeaders(init?: HeadersInit): Promise<Headers> {
  const headers = new Headers(init);
  headers.set("Content-Type", "application/json");
  const token = (await getToken?.()) ?? null;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

export async function fetchApi(
  path: string,
  init?: RequestInit & { _noTimeout?: boolean },
): Promise<Response> {
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;
  const { _noTimeout, ...fetchInit } = init ?? {};
  const controller = new AbortController();
  const timeout = _noTimeout
    ? null
    : setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(url, {
      ...fetchInit,
      headers: await buildHeaders(fetchInit.headers),
      signal: fetchInit.signal ?? controller.signal,
    });
    return res;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

async function parseJsonResponse<T>(res: Response): Promise<T | undefined> {
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : undefined;
  }
  return undefined;
}

async function toApiResponse<T>(res: Response): Promise<ApiResponse<T>> {
  if (!res.ok) {
    let errMsg = "";
    try {
      errMsg = await res.text();
    } catch (e) {
      errMsg = `Unable to extract error response body; ${(e as Error).message}`;
    }
    throw new ApiError(`Request failed [${res.status}]: ${errMsg}`, res.status);
  }
  const data = await parseJsonResponse<T>(res);
  return { data, status: res.status };
}

export const api = {
  async get<T = unknown>(
    path: string,
    params?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    const search = params ? `?${new URLSearchParams(params)}` : "";
    const res = await fetchApi(path + search);
    return toApiResponse<T>(res);
  },
  async post<T = unknown>(
    path: string,
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    const res = await fetchApi(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
    return toApiResponse<T>(res);
  },
  async patch<T = unknown>(
    path: string,
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    const res = await fetchApi(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
    return toApiResponse<T>(res);
  },
  async put<T = unknown>(
    path: string,
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    const res = await fetchApi(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
    return toApiResponse<T>(res);
  },
  async delete<T = unknown>(path: string): Promise<ApiResponse<T>> {
    const res = await fetchApi(path, { method: "DELETE" });
    return toApiResponse<T>(res);
  },
};

export const getReviews = async ({
  targetType,
  targetId,
  skip = 0,
  limit = 100,
  reviewSource,
}: GetReviewsParams): Promise<Review[]> => {
  if (skip < 0) throw new Error("skip must be a non-negative number");
  if (limit <= 0) throw new Error("limit must be a positive number");

  const params: Record<string, string> = {
    skip: skip.toString(),
    limit: limit.toString(),
    target_id: targetId.toString(),
  };
  if (targetType) params.target_type = targetType;
  if (reviewSource) params.review_source = reviewSource;

  const res = await api.get<Review[]>("/reviews", params);
  return res.data ?? [];
};
