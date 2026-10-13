import { supabase, SUPABASE_STORAGE_KEY } from "../api/supabaseClient";

const TOKEN_KEY = "tapit_token";

export function saveAuthToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Prefers a Supabase session (getSession refreshes an expired access token
// first), falling back to the local token while both auth systems coexist.
export async function getAccessToken(): Promise<string | null> {
    if (supabase) {
        const { data } = await supabase.auth.getSession();

        if (data.session)
            return data.session.access_token;
    }

    return getAuthToken();
}

export function clearAuthToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export async function clearSupabaseSession(): Promise<void> {
    if (!supabase) return;

    let signedOut: boolean;

    try {
        const { error } = await supabase.auth.signOut({ scope: "local" });
        signedOut = !error;
    } catch {
        signedOut = false;
    }

    // signOut keeps the session if its revoke request fails (e.g. offline),
    // so drop it from storage directly -- sign-out must always take effect.
    if (!signedOut)
        localStorage.removeItem(SUPABASE_STORAGE_KEY);
}
