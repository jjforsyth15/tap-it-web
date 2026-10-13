import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { clearAuthToken, clearSupabaseSession, getAuthToken, saveAuthToken } from "../utils/authStorage";
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
    // Changes when the Supabase identity changes, so the current user is reloaded.
    const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);

    // Supabase sign-in stores its own session, so only local login passes a token.
    // Only one kind of login may exist at a time, so a local login first clears
    // any Supabase session (and the SIGNED_IN handler clears the local token).
    async function login(token?: string) {
        if (token) {
            await clearSupabaseSession();
            saveAuthToken(token);
        }
        setIsLoggedIn(true);
    }

    // Sign-out finishes before the UI logs out, so nothing can pick up a session
    // that's still stored.
    async function logout() {
        await clearSupabaseSession();
        clearAuthToken();
        setIsLoggedIn(false);
        setUser(null);
        setSupabaseUserId(null);
        setIsAuthLoading(false);
    }

    useEffect(() => {
        if (!supabase) return;

        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "INITIAL_SESSION") {
                if (session) {
                    clearAuthToken();
                    setSupabaseUserId(session.user.id);
                    setIsLoggedIn(true);
                } else if (!getAuthToken()) {
                    setIsAuthLoading(false);
                }
            }

            // Also fires for sign-ins in other tabs and on tab refocus; the same id
            // is a no-op, so the user only reloads when the identity changes.
            if (event === "SIGNED_IN" && session) {
                clearAuthToken();
                setSupabaseUserId(session.user.id);
                setIsLoggedIn(true);
            }

            // signOut() always emits this (even with no session), so it must only
            // update state -- calling logout() here would loop. A legacy token here
            // means a local login just replaced the Supabase session, so stay logged in.
            if (event === "SIGNED_OUT") {
                setSupabaseUserId(null);

                if (!getAuthToken()) {
                    setIsLoggedIn(false);
                    setUser(null);
                    setIsAuthLoading(false);
                }
            }
        });

        return () => {
            data.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        function handleAuthExpired() {
            void logout();
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
                    void logout();
            } finally {
                if (!cancelled) 
                    setIsAuthLoading(false);
            }
        }

        void loadCurrentUser();

        return () => {
            cancelled = true;
        };
    }, [isLoggedIn, supabaseUserId]);

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