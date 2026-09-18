import { apiRequest } from "./client";
import type { User } from "../types/user";
import type { EmailChangeRequest, EmailChangeResponse, EmailChangeConfirmResponse, EmailChangeCancelResponse } from "../types/auth";
import { getAuthToken } from "../utils/authStorage";

export function getCurrentUser(): Promise<User> {
    return apiRequest<User>("/users/me");
}

export function requestEmailChange(data: EmailChangeRequest): Promise<EmailChangeResponse> {
    return apiRequest<EmailChangeResponse>("/users/me/email/change", {
        method: "POST",
        // Pass the token explicitly so a 401 here (wrong step-up password/Google
        // credential) surfaces as a normal ApiError instead of apiRequest's
        // authToken===undefined branch treating it as an expired session and
        // force-logging the user out. Same pattern as authApi.ts's linkGoogleAccount.
        authToken: getAuthToken() ?? undefined,
        body: JSON.stringify(data),
    });
}

export function confirmEmailChange(token: string): Promise<EmailChangeConfirmResponse> {
    return apiRequest<EmailChangeConfirmResponse>("/users/me/email/confirm", {
        method: "POST",
        requiresAuth: false,
        body: JSON.stringify({ token }),
    });
}

export function cancelEmailChange(token: string): Promise<EmailChangeCancelResponse> {
    return apiRequest<EmailChangeCancelResponse>("/users/me/email/cancel", {
        method: "POST",
        requiresAuth: false,
        body: JSON.stringify({ token }),
    });
}