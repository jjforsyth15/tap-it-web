import { getAuthToken } from "../utils/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || 'API request failed');
    }

    return data;
}