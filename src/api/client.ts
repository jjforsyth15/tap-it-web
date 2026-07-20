import { getAuthToken, clearAuthToken } from "../utils/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_EXPIRED_EVENT = "auth_expired";
interface FastApiValidationError {
    msg?: string;
}

interface ApiErrorResponse {
    detail?: string | FastApiValidationError[];
}

function buildHeaders(options: RequestInit): HeadersInit {
    const token = getAuthToken();
    const isFormData = options.body instanceof FormData;

    return {
        ...(!isFormData && { "content-type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };
}

async function parseResponse(response: Response): Promise<unknown> {
    return response.json().catch(() => null);  
}

function getErrorMessage(data: unknown): string {
    if(!data || typeof data !== "object") {
        return "Something went wrong.";
    }

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

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: buildHeaders(options),
    });

    const data = await parseResponse(response);

    if (response.status === 401) 
        handleUnauthorizedResponse();

    if (!response.ok) 
        throw new Error(getErrorMessage(data));

    return data as T;
}

