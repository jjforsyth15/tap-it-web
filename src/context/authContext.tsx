import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { clearAuthToken, getAuthToken, saveAuthToken } from "../utils/authStorage";
import { AUTH_EXPIRED_EVENT } from "../api/client";
import type { AuthContextType } from "../types/auth";
import type { User } from "../types/user";
import { getCurrentUser } from "../api/userApi";


const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!getAuthToken());
    const [isAuthLoading, setIsAuthLoading] = useState(() => !!getAuthToken());
    const [user, setUser] = useState<User | null>(null);

    function login(token: string) {
        saveAuthToken(token);
        setIsLoggedIn(true);
    }

    function logout() {
        clearAuthToken();
        setIsLoggedIn(false);
        setUser(null);
        setIsAuthLoading(false);
    }

    useEffect(() => {
        function handleAuthExpired() {
            logout();
        }

        window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

        return () => {
            window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
        };
    }, []);

    useEffect(() => {
        if (!isLoggedIn) {
            setUser(null);
            setIsAuthLoading(false);
            return;
        }

        let cancelled = false;

        async function loadCurrentUser() {
            try {
                setIsAuthLoading(true);
                const userData = await getCurrentUser();

                if (!cancelled) 
                    setUser(userData);
            } catch {
                if (!cancelled) 
                    logout();
            } finally {
                if (!cancelled) 
                    setIsAuthLoading(false);
            }
        }

        void loadCurrentUser();

        return () => {
            cancelled = true;
        };
    }, [isLoggedIn]);

    const authContextValue: AuthContextType = {
        isLoggedIn,
        isAuthLoading,
        user,
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