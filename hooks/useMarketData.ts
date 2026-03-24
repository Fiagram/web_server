'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
    fetchMarketData,
    DEFAULT_POLL_INTERVAL_MS,
} from '@/lib/actions/market.actions'
import { defaultIndicatorGroups } from '@/constants'

interface UseMarketDataOptions {
    /** Polling interval in ms. Defaults to 5 000 ms. */
    interval?: number
    /** Start polling automatically on mount. Defaults to `true`. */
    autoStart?: boolean
}

interface UseMarketDataReturn {
    groups: IndicatorGroup[]
    /** True while the very first fetch is in-flight. */
    isLoading: boolean
    /** Timestamp (ms) of the most recent successful update. */
    lastUpdated: number | null
    /** Whether the poller is currently active. */
    isLive: boolean
    /** Pause real-time updates. */
    pause: () => void
    /** Resume real-time updates. */
    resume: () => void
    /** Force a single immediate refresh. */
    refresh: () => Promise<void>
}

export function useMarketData(opts: UseMarketDataOptions = {}): UseMarketDataReturn {
    const { interval = DEFAULT_POLL_INTERVAL_MS, autoStart = true } = opts

    const [groups, setGroups] = useState<IndicatorGroup[]>(defaultIndicatorGroups)
    const [isLoading, setIsLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<number | null>(null)
    const [isLive, setIsLive] = useState(autoStart)

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const mountedRef = useRef(true)

    const doFetch = useCallback(async () => {
        try {
            const data = await fetchMarketData()
            if (mountedRef.current) {
                setGroups(data)
                setLastUpdated(Date.now())
                setIsLoading(false)
            }
        } catch (err) {
            console.error('Market data fetch error:', err)
            if (mountedRef.current) setIsLoading(false)
        }
    }, [])

    // Start / stop the polling interval
    useEffect(() => {
        mountedRef.current = true

        if (isLive) {
            // Fetch immediately on start
            doFetch()
            timerRef.current = setInterval(doFetch, interval)
        }

        return () => {
            mountedRef.current = false
            if (timerRef.current) {
                clearInterval(timerRef.current)
                timerRef.current = null
            }
        }
    }, [isLive, interval, doFetch])

    const pause = useCallback(() => setIsLive(false), [])
    const resume = useCallback(() => setIsLive(true), [])
    const refresh = useCallback(async () => { await doFetch() }, [doFetch])

    return { groups, isLoading, lastUpdated, isLive, pause, resume, refresh }
}
