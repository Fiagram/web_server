/**
 * Client-side account helpers.
 *
 * Account data is kept in localStorage for convenient client-side reads
 * (e.g. pre-filling UI without a network call).  The server always fetches
 * fresh data from GET /users/me using the access_token cookie, so no
 * account cookie is needed.
 */

const ACCOUNT_KEY = "account";

/** Persist the signed-in account to localStorage. */
export function saveAccount(account: Account): void {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
}

/** Remove the account from localStorage. */
export function clearAccount(): void {
    localStorage.removeItem(ACCOUNT_KEY);
}

/** Read the account from localStorage (client-side only). */
export function getAccountFromStorage(): Account | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(ACCOUNT_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as Account;
    } catch {
        return null;
    }
}
