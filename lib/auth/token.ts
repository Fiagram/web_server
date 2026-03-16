/**
 * Client-side access-token lifecycle manager.
 *
 * Responsibilities:
 *  - Persist the JWT access token **and** its `exp` timestamp in localStorage.
 *  - Automatically schedule a silent refresh 30 s before the token expires
 *    by calling `POST /auth/token/refresh` (the refresh token travels in an
 *    HttpOnly cookie set by the backend).
 *  - Expose helpers consumed by AuthForm, Footer sign-out, etc.
 */

import { API_BASE_URL } from "@/lib/api";

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

const TOKEN_KEY = "token";
const TOKEN_EXP_KEY = "token_exp";

/** Buffer in seconds — refresh this many seconds before actual expiry. */
const REFRESH_BUFFER_SECONDS = 30;

let refreshTimerId: ReturnType<typeof setTimeout> | null = null;

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/** Return the current access token, or `null` when unavailable. */
export function getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

/** Return the `exp` claim (unix seconds) stored alongside the token. */
export function getTokenExp(): number | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(TOKEN_EXP_KEY);
    if (!raw) return null;

    const exp = parseInt(raw, 10);
    return Number.isNaN(exp) ? null : exp;
}

/**
 * Persist a new access token + expiry and (re-)schedule the silent refresh.
 */
export function setAccessToken(token: string, exp: number): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXP_KEY, exp.toString());
    scheduleTokenRefresh(exp);
}

/**
 * Remove the stored token and cancel any pending refresh timer.
 * Call this on explicit sign-out **before** hitting the sign-out endpoint.
 */
export function clearAccessToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXP_KEY);
    cancelScheduledRefresh();
}

/**
 * Bootstrap: call once on app mount to validate and re-schedule refresh.
 * Returns `false` when the stored access token is missing/invalid.
 */
export function initTokenRefresh(): boolean {
    const token = getAccessToken();
    const exp = getTokenExp();

    if (!token || !exp) {
        clearAccessToken();
        return false;
    }

    scheduleTokenRefresh(exp);
    return true;
}

// ---------------------------------------------------------------------------
// Refresh logic
// ---------------------------------------------------------------------------

function cancelScheduledRefresh(): void {
    if (refreshTimerId !== null) {
        clearTimeout(refreshTimerId);
        refreshTimerId = null;
    }
}

function scheduleTokenRefresh(exp: number): void {
    cancelScheduledRefresh();

    const nowSeconds = Math.floor(Date.now() / 1000);
    const delayMs = (exp - nowSeconds - REFRESH_BUFFER_SECONDS) * 1000;

    if (delayMs <= 0) {
        // Token is already (almost) expired — attempt an immediate refresh.
        refreshAccessToken();
        return;
    }

    refreshTimerId = setTimeout(() => {
        refreshAccessToken();
    }, delayMs);
}

/**
 * Call the backend refresh endpoint.  On success the new token + exp are
 * persisted and the next refresh is scheduled automatically.  On failure the
 * session is cleared and the user is redirected to the sign-in page.
 */
export async function refreshAccessToken(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/token/refresh`, {
            method: "POST",
            credentials: "include", // sends the HttpOnly refresh_token cookie
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Token refresh failed with status:", response.status);
            clearAccessToken();
            window.location.href = "/sign-in";
            return false;
        }

        const data = await response.json();

        if (data.accessToken?.token && data.accessToken?.exp) {
            setAccessToken(data.accessToken.token, data.accessToken.exp);
            return true;
        }

        // Unexpected response shape — treat as failure.
        clearAccessToken();
        window.location.href = "/sign-in";
        return false;
    } catch (error) {
        console.error("Token refresh error:", error);
        clearAccessToken();
        window.location.href = "/sign-in";
        return false;
    }
}
