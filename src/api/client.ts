import { getAuthToken, clearAuthToken } from "../utils/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();
    const isFormData = options.body instanceof FormData;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    });

    const data = await response.json().catch(() => null);

    if (response.status === 401) {
        clearAuthToken();
        notifyAuthExpired();
        throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
        const errorMessage = Array.isArray(data.detail)
            ? data.detail[0]?.msg
            : data?.detail;
            
        throw new Error(errorMessage || "Something went wrong.");
    }

    return data;
}


export const AUTH_EXPIRED_EVENT = "auth_expired";

export function notifyAuthExpired() {
    const event = new CustomEvent(AUTH_EXPIRED_EVENT);
    window.dispatchEvent(event);
}