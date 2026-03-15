/**
 * Base URL for all backend API requests.
 *
 * Reads from the NEXT_PUBLIC_API_BASE_URL environment variable so the value is
 * available in both server and client components.  Falls back to the local
 * development server when the variable is not set.
 */
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";
