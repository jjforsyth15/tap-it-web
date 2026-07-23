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