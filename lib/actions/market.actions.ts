/**
 * Market data service.
 *
 * Exposes `fetchMarketData()` which returns the latest indicator groups.
 * Currently backed by a **simulation layer** that applies small random
 * fluctuations to the seed data on every call — giving a realistic real-time
 * feel.  Swap the implementation of `fetchMarketData` to hit a real API
 * (e.g. your backend, CoinGecko, Yahoo Finance) when ready.
 */

import { defaultIndicatorGroups } from '@/constants'

// ---------------------------------------------------------------------------
// Internal state — keeps a running "last known" snapshot so ticks are relative
// ---------------------------------------------------------------------------

let snapshot: IndicatorGroup[] = structuredClone(defaultIndicatorGroups)

/**
 * Apply a small random walk to a numeric value.
 * `volatility` controls max % change per tick (default 0.35 %).
 */
function jitter(value: number, volatility = 0.0035): number {
    const delta = value * volatility * (Math.random() * 2 - 1)
    return +(value + delta)
}

function tickAsset(asset: IndicatorAsset): IndicatorAsset {
    const newValue = jitter(asset.currentValue)
    // Recompute the week change slightly so the chip moves too
    return {
        ...asset,
        currentValue: +newValue.toFixed(4),
        changeWeek: +(asset.changeWeek + (Math.random() * 0.2 - 0.1)).toFixed(2),
        changeMonth: +(asset.changeMonth + (Math.random() * 0.06 - 0.03)).toFixed(2),
        changeYear: +(asset.changeYear + (Math.random() * 0.02 - 0.01)).toFixed(2),
    }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Polling interval recommendation (ms). Consumers can override. */
export const DEFAULT_POLL_INTERVAL_MS = 5_000

/**
 * Fetch the latest market data for all indicator groups.
 *
 * TODO: Replace the body with a real `fetch()` call when a market-data
 *       endpoint is available, e.g.:
 *       ```
 *       const res = await fetch(`${API_BASE_URL}/market/indicators`)
 *       return (await res.json()) as IndicatorGroup[]
 *       ```
 */
export async function fetchMarketData(): Promise<IndicatorGroup[]> {
    // Simulate network latency (20-80 ms)
    await new Promise((r) => setTimeout(r, 20 + Math.random() * 60))

    snapshot = snapshot.map((group) => ({
        ...group,
        assets: group.assets.map(tickAsset),
    }))

    return structuredClone(snapshot)
}
