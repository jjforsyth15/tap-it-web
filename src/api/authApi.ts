import type { RegisterData, LoginResponse } from "../types/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function registerUser(data: RegisterData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.detail || "Registration failed");
    }

    return responseData;
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