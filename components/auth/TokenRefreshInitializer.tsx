'use client'

import { useEffect } from 'react'
import { initTokenRefresh } from '@/lib/auth/token'
import { usePathname, useRouter } from 'next/navigation'

/**
 * Invisible client component that bootstraps the silent token-refresh timer
 * on mount.  Drop it inside any layout that requires an authenticated session.
 */
const TokenRefreshInitializer = () => {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const isAccessTokenValid = initTokenRefresh()

        if (!isAccessTokenValid && pathname !== '/sign-in' && pathname !== '/sign-up') {
            router.replace('/sign-in')
            return
        }
    }, [pathname, router])

    return null
}

export default TokenRefreshInitializer
