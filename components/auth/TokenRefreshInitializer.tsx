'use client'

import { useEffect } from 'react'
import { initTokenRefresh } from '@/lib/auth/token'

/**
 * Invisible client component that bootstraps the silent token-refresh timer
 * on mount.  Drop it inside any layout that requires an authenticated session.
 */
const TokenRefreshInitializer = () => {
    useEffect(() => {
        initTokenRefresh()
    }, [])

    return null
}

export default TokenRefreshInitializer
