'use client'

import { useState } from 'react'
import { useMarketData } from '@/hooks/useMarketData'
import AssetGroupSection from './AssetGroupSection'
import { Settings, Pause, Play, RefreshCw } from 'lucide-react'

const FinancialIndicatorsPanel = () => {
    const { groups, isLoading, lastUpdated, isLive, pause, resume, refresh } = useMarketData({
        interval: 5_000,
    })
    const [showConfig, setShowConfig] = useState(false)

    return (
        <section className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-5 shadow-chart">
            {/* Panel header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-18 font-semibold text-gray-900">Financial Indicators</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-12 text-gray-500">
                            Key market indices &amp; assets — worldwide &amp; Vietnam
                        </p>
                        {lastUpdated && (
                            <span className="text-10 text-gray-400">
                                Updated {new Date(lastUpdated).toLocaleTimeString()}
                            </span>
                        )}
                        {isLive && (
                            <span className="inline-flex items-center gap-1 text-10 text-green-600 font-medium">
                                <span className="relative flex size-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                    <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                                </span>
                                LIVE
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={isLive ? pause : resume}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                        aria-label={isLive ? 'Pause live updates' : 'Resume live updates'}
                        title={isLive ? 'Pause' : 'Resume'}
                    >
                        {isLive ? <Pause className="size-4" /> : <Play className="size-4" />}
                    </button>
                    <button
                        onClick={refresh}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Refresh now"
                        title="Refresh now"
                    >
                        <RefreshCw className="size-4" />
                    </button>
                    <button
                        onClick={() => setShowConfig(!showConfig)}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Configure indicators"
                    >
                        <Settings className="size-5" />
                    </button>
                </div>
            </div>

            {/* Configuration placeholder */}
            {showConfig && (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-14 text-gray-500">
                    <p className="font-medium text-gray-700 mb-1">Customize Indicators</p>
                    <p>
                        You can add or remove assets within each group. For example, add <strong>BNB</strong> and{' '}
                        <strong>Solana</strong> to the Crypto group, or add <strong>UPCOM</strong> to the
                        Vietnamese Stock Market group.
                    </p>
                    <p className="mt-2 text-12 italic">Configuration panel coming soon.</p>
                </div>
            )}

            {/* Groups */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12 text-gray-400 text-14">
                    Loading market data…
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {groups.map((group) => (
                        <AssetGroupSection key={group.id} group={group} />
                    ))}
                </div>
            )}
        </section>
    )
}

export default FinancialIndicatorsPanel
