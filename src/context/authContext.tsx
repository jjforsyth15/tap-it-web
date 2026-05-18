import { createContext, useContext, useState, type ReactNode } from "react";
import { clearAuthToken, getAuthToken, saveAuthToken } from "../utils/authStorage";


type AuthContextType = {
    isLoggedIn: boolean;
    login: (token: string) => void;
    logout: () => void;
};

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