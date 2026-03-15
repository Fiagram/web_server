import { parseStringify } from "../utils";
import { API_BASE_URL } from "@/lib/api";
import { clearAccessToken } from "@/lib/auth/token";

/**
 * Sign out the current session completely:
 * 1. Clear the client-side access token & cancel any scheduled refresh.
 * 2. Call POST /auth/token/signout so the backend revokes the refresh-token
 *    cookie (expects a 204 on success).
 */
export const signOutAccount = async (): Promise<boolean> => {
    try {
        // 1 — wipe client-side token state first
        clearAccessToken();

        // 2 — revoke the refresh-token cookie on the server
        const response = await fetch(`${API_BASE_URL}/auth/token/signout`, {
            method: 'POST',
            credentials: 'include', // sends the HttpOnly refresh_token cookie
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // 204 has no body, only handle error responses
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                const errorData = await response.json();
                console.error('Sign-out failed:', errorData.message || errorData.code);
            }
            return false;
        }

        console.log('Sign out successfully');
        return true;
    } catch (error) {
        console.error('Sign-out error:', error);
        return false;
    }
};

export const getLoggedInAccount = async () => {
    try {
        const account: Account = {
            username: "tamnnm",
            fullname: "Nguyễn Ngọc Minh Tâm",
            email: "adsfadf@gmail.com",
            phoneNumber: {
                countryCode: "+84",
                number: "123456789",
            },
            role: "member",
        };
        return parseStringify(account);
    } catch (error) {
        console.log(error);
        return null;
    }
}