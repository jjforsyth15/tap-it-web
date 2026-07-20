import type { RegisterData, LoginResponse } from "../types/auth";
import { apiRequest } from "./client";

export async function registerUser(data: RegisterData) {
    return apiRequest("/auth/register", {
        method: "POST",
        requiresAuth: false,
        body: JSON.stringify(data),
    });
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    return apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        requiresAuth: false,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
    });
}
