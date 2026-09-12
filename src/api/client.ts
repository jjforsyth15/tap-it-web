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
    authToken?: string;
}

export class ApiError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

function buildHeaders(options: ApiRequestOptions, requiresAuth: boolean, authToken?: string): HeadersInit {
    const token = authToken ?? (requiresAuth ? getAuthToken() : null);

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
    const { requiresAuth = true, authToken, ...requestOptions } = options;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...requestOptions,
        headers: buildHeaders(requestOptions, requiresAuth, authToken),
    });

    const data = await parseResponse(response);

    if (response.status === 401 && requiresAuth && authToken === undefined) 
        handleUnauthorizedResponse();

    if (!response.ok)
        throw new ApiError(getErrorMessage(data), response.status);

    return data as T;
}

