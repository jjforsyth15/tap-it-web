const TOKEN_KEY = "tapit_token";

export function saveAuthToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken() {
    localStorage.removeItem(TOKEN_KEY);
}
