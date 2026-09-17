import type { User } from "./user";

export type RegisterData = {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
};

export type RegisterResponse = {
    message: string;
    email: string;
};

export type LoginResponse = {
    first_name: string;
    last_name: string;
    access_token: string;
    token_type: string;
};

export type AuthContextType = {
    isLoggedIn: boolean;
    isAuthLoading: boolean;
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
};

export type GoogleAuthRequest = {
    credential: string;
};

export type GoogleLinkResponse = {
    success: boolean;
    message: string;
    access_token?: string;
};

export type EmailVerificationResponse = {
    message: string;
};

export type ForgotPasswordResponse = {
    message: string;
};

export type ResetPasswordResponse = {
    message: string;
};

export type EmailChangeRequest = {
    new_email: string;
    current_password?: string;
    google_credential?: string;
};

export type EmailChangeResponse = {
    message: string;
};

export type EmailChangeConfirmRequest = {
    token: string;
};

export type EmailChangeConfirmResponse = {
    message: string;
};

export type EmailChangeCancelRequest = {
    token: string;
};

export type EmailChangeCancelResponse = {
    message: string;
};