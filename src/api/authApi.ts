import type { RegisterData, LoginResponse, RegisterResponse, GoogleAuthRequest, GoogleLinkResponse, EmailVerificationResponse } from "../types/auth";
import { apiRequest } from "./client";

export async function registerUser(data: RegisterData): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>("/auth/register", {
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



export async function googleLogin(data: GoogleAuthRequest): Promise<LoginResponse> {
    return apiRequest<LoginResponse>("/auth/google", {
        method: "POST",
        requiresAuth: false,
        body: JSON.stringify(data),
    });
}   

export async function linkGoogleAccount(data: GoogleAuthRequest, authToken?: string): Promise<GoogleLinkResponse> {
    return apiRequest<GoogleLinkResponse>("/auth/google/link", {
        method: "POST",
        requiresAuth: true,
        authToken,
        body: JSON.stringify(data),
    });
}

export async function verifyEmail(token: string): Promise<EmailVerificationResponse> {
    return apiRequest<EmailVerificationResponse>("/auth/verify-email", {
        method: "POST",
        requiresAuth: false,
        body: JSON.stringify({ token }),
    });
}

export async function resendVerification(email: string): Promise<EmailVerificationResponse> {
    return apiRequest<EmailVerificationResponse>("/auth/resend-verification", {
        method: "POST",
        requiresAuth: false,
        body: JSON.stringify({ email }),
    });
}