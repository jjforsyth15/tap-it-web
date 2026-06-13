import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { clearAuthToken, getAuthToken, saveAuthToken } from "../utils/authStorage";
import { AUTH_EXPIRED_EVENT } from "../api/client";
import type { AuthContextType } from "../types/auth";


const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!getAuthToken());

    function login(token: string) {
        saveAuthToken(token);
        setIsLoggedIn(true);
    }

    function logout() {
        clearAuthToken();
        setIsLoggedIn(false);
    }

    useEffect(() => {
        function handleAuthExpired() {
            logout();
            setIsLoggedIn(false);
        }

        window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

        return () => {
            window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
        };
    }, []);

    const authContextValue: AuthContextType = {
        isLoggedIn,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}