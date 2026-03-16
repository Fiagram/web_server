/**
 * Base URL for all backend API requests.
 *
 * Reads from the NEXT_PUBLIC_API_BASE_URL environment variable so the value is
 * available in both server and client components. Throws immediately when the
 * variable is not set so the app fails fast during startup.
 */
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
    throw new Error("Missing required environment variable: NEXT_PUBLIC_API_BASE_URL");
}

export const API_BASE_URL = apiBaseUrl;
