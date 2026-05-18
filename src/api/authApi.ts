import { apiRequest } from "./client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type RegisterData = {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
};

type LoginResponse = {
    access_token: string;
    token_type: string;
};

export function registerUser(data: RegisterData) {
    return apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Login failed");
    }

    return data;
}