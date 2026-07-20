import { getAuthToken, clearAuthToken } from "../utils/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const AUTH_EXPIRED_EVENT = "auth_expired";
interface FastApiValidationError {
    msg?: string;
}

interface ApiErrorResponse {
    detail?: string | FastApiValidationError[];
}

interface ApiRequestOptions extends RequestInit {
    requiresAuth?: boolean;
}

function buildHeaders(options: RequestInit, requiresAuth: boolean): HeadersInit {
    const token = requiresAuth ? getAuthToken() : null;

    const hasCustomContentType = new Headers(options.headers).has("content-type");

    const shouldUseJsonContentType = 
        options.body !== undefined && 
        !(options.body instanceof FormData) && 
        !(options.body instanceof URLSearchParams) && 
        !hasCustomContentType;

    const headers = new Headers(options.headers);

    if (shouldUseJsonContentType) 
        headers.set("content-type", "application/json");

    if (token)
        headers.set("authorization", `Bearer ${token}`);

    return headers;
}

async function parseResponse(response: Response): Promise<unknown> {
    return response.json().catch(() => null);  
}

function getErrorMessage(data: unknown): string {
    if(!data || typeof data !== "object") 
        return "Something went wrong.";

    const errorData = data as ApiErrorResponse;

    if (Array.isArray(errorData.detail)) 
        return errorData.detail[0]?.msg || "Something went wrong.";

    return errorData.detail || "Something went wrong.";
}

export function notifyAuthExpired(): void {
    window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}

function handleUnauthorizedResponse(): never {
    clearAuthToken();
    notifyAuthExpired();
    throw new Error("Session expired. Please log in again.");
}

export async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const { requiresAuth = true, ...requestOptions } = options;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...requestOptions,
        headers: buildHeaders(options, requiresAuth),
    });

    const data = await parseResponse(response);

    if (response.status === 401 && requiresAuth) 
        handleUnauthorizedResponse();

    if (!response.ok) 
        throw new Error(getErrorMessage(data));

    return data as T;
}

