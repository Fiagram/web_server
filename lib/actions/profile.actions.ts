import { API_BASE_URL } from '@/lib/api'
import { getAccessToken } from '@/lib/auth/token'
import { saveAccount } from '@/lib/auth/account'

/** Authenticated fetch helper — attaches Bearer token + cookies. */
async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = getAccessToken()
    return fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers ?? {}),
        },
    })
}

// -------------------------------- Profile Me

export async function getProfileMe(): Promise<Account | null> {
    try {
        const res = await authFetch(`${API_BASE_URL}/profile/me`)
        if (!res.ok) return null
        const data: ProfileMeResponse = await res.json()
        if (data.account) saveAccount(data.account)
        return data.account
    } catch (err) {
        console.error('getProfileMe error:', err)
        return null
    }
}

export async function updateProfileMe(
    payload: UpdateProfileMeRequest
): Promise<Account | null> {
    try {
        const res = await authFetch(`${API_BASE_URL}/profile/me`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        })
        if (!res.ok) {
            const errData = await res.json().catch(() => null)
            throw new Error(errData?.message ?? `Update failed (${res.status})`)
        }
        const data: ProfileMeResponse = await res.json()
        if (data.account) saveAccount(data.account)
        return data.account
    } catch (err) {
        console.error('updateProfileMe error:', err)
        throw err
    }
}

// -------------------------------- Password

export async function updatePassword(
    payload: UpdatePasswordRequest
): Promise<void> {
    const res = await authFetch(`${API_BASE_URL}/profile/me/password`, {
        method: 'PUT',
        body: JSON.stringify(payload),
    })
    if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(errData?.message ?? `Password update failed (${res.status})`)
    }
}

// -------------------------------- Webhooks

export async function getWebhooks(
    limit = 20,
    offset = 0
): Promise<Webhook[]> {
    try {
        const res = await authFetch(
            `${API_BASE_URL}/profile/webhooks?limit=${limit}&offset=${offset}`
        )
        if (!res.ok) return []
        return (await res.json()) as Webhook[]
    } catch (err) {
        console.error('getWebhooks error:', err)
        return []
    }
}

export async function getWebhook(webhookId: number): Promise<Webhook | null> {
    try {
        const res = await authFetch(`${API_BASE_URL}/profile/webhooks/${webhookId}`)
        if (!res.ok) return null
        return (await res.json()) as Webhook
    } catch (err) {
        console.error('getWebhook error:', err)
        return null
    }
}

export async function createWebhook(
    webhook: Omit<Webhook, 'id'>
): Promise<Webhook | null> {
    try {
        const res = await authFetch(`${API_BASE_URL}/profile/webhooks`, {
            method: 'POST',
            body: JSON.stringify(webhook),
        })
        if (!res.ok) {
            const errData = await res.json().catch(() => null)
            throw new Error(errData?.message ?? `Create webhook failed (${res.status})`)
        }
        return (await res.json()) as Webhook
    } catch (err) {
        console.error('createWebhook error:', err)
        throw err
    }
}

export async function updateWebhook(
    webhookId: number,
    webhook: Omit<Webhook, 'id'>
): Promise<Webhook | null> {
    try {
        const res = await authFetch(`${API_BASE_URL}/profile/webhooks/${webhookId}`, {
            method: 'PUT',
            body: JSON.stringify(webhook),
        })
        if (!res.ok) {
            const errData = await res.json().catch(() => null)
            throw new Error(errData?.message ?? `Update webhook failed (${res.status})`)
        }
        return (await res.json()) as Webhook
    } catch (err) {
        console.error('updateWebhook error:', err)
        throw err
    }
}

export async function deleteWebhook(webhookId: number): Promise<boolean> {
    try {
        const res = await authFetch(`${API_BASE_URL}/profile/webhooks/${webhookId}`, {
            method: 'DELETE',
        })
        return res.ok || res.status === 204
    } catch (err) {
        console.error('deleteWebhook error:', err)
        return false
    }
}
