import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { clearAuthToken, getAuthToken, saveAuthToken } from "../utils/authStorage";
import { AUTH_EXPIRED_EVENT } from "../api/client";
import type { AuthContextType } from "../types/auth";
import type { User } from "../types/user";
import { getCurrentUser } from "../api/userApi";
import { supabase } from "../api/supabaseClient";


const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!getAuthToken());
    // With Supabase configured, stay loading until its stored session has been checked.
    const [isAuthLoading, setIsAuthLoading] = useState(() => !!supabase || !!getAuthToken());
    const [user, setUser] = useState<User | null>(null);

    // Supabase sign-in stores its own session, so only local login passes a token.
    function login(token?: string) {
        if (token)
            saveAuthToken(token);
        setIsLoggedIn(true);
    }

    function logout() {
        clearAuthToken();
        setIsLoggedIn(false);
        setUser(null);
        setIsAuthLoading(false);
        void supabase?.auth.signOut({ scope: "local" });
    }

    useEffect(() => {
        if (!supabase) return;

        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "INITIAL_SESSION") {
                if (session)
                    setIsLoggedIn(true);
                else if (!getAuthToken())
                    setIsAuthLoading(false);
            }

            // signOut() always emits this (even with no session), so it must only
            // clear state -- calling logout() here would loop.
            if (event === "SIGNED_OUT") {
                clearAuthToken();
                setIsLoggedIn(false);
                setUser(null);
                setIsAuthLoading(false);
            }
        });

        return () => {
            data.subscription.unsubscribe();
        };
    }, []);

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
        if (!isLoggedIn) return;

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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}