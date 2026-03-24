'use client'

import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'

const formatValue = (value: number): string => {
    if (value >= 1) {
        return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
    return value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
}

const ChangeChip = ({ label, value }: { label: string; value: number }) => {
    const isPositive = value >= 0
    return (
        <span
            className={cn(
                'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-10 font-medium transition-colors duration-300',
                isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            )}
        >
            <span className="text-[9px] opacity-70">{label}</span>
            {isPositive ? '+' : ''}
            {value.toFixed(2)}%
        </span>
    )
}

const AssetCard = ({ asset }: { asset: IndicatorAsset }) => {
    const [showTooltip, setShowTooltip] = useState(false)
    const [flash, setFlash] = useState<'up' | 'down' | null>(null)
    const prevValueRef = useRef(asset.currentValue)
    const isCurrentPositive = asset.changeWeek >= 0

    // Detect value changes and trigger a brief flash
    useEffect(() => {
        const prev = prevValueRef.current
        if (prev !== asset.currentValue) {
            setFlash(asset.currentValue > prev ? 'up' : 'down')
            const timer = setTimeout(() => setFlash(null), 600)
            prevValueRef.current = asset.currentValue
            return () => clearTimeout(timer)
        }
    }, [asset.currentValue])

    return (
        <div
            className={cn(
                'relative flex flex-col justify-between rounded-xl border p-4 min-w-45 max-w-55 h-35 shadow-sm transition-all duration-300 hover:shadow-md',
                isCurrentPositive ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50',
                flash === 'up' && 'ring-2 ring-green-400/60',
                flash === 'down' && 'ring-2 ring-red-400/60',
            )}
        >
            {/* Top: percentage changes */}
            <div className="flex flex-wrap gap-1">
                <ChangeChip label="1W" value={asset.changeWeek} />
                <ChangeChip label="1M" value={asset.changeMonth} />
                <ChangeChip label="1Y" value={asset.changeYear} />
            </div>

            {/* Bottom: symbol + current value */}
            <div className="flex items-end justify-between gap-2 mt-auto">
                <div
                    className="relative"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <span
                        className={cn(
                            'text-14 font-bold cursor-default',
                            isCurrentPositive ? 'text-green-700' : 'text-red-700'
                        )}
                    >
                        {asset.symbol}
                    </span>
                    {showTooltip && (
                        <div className="absolute bottom-full left-0 mb-1 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-10 text-white shadow-lg z-10">
                            {asset.name}
                        </div>
                    )}
                </div>

                <span
                    className={cn(
                        'text-16 font-semibold tabular-nums transition-colors duration-300',
                        flash === 'up' && 'text-green-500',
                        flash === 'down' && 'text-red-500',
                        !flash && isCurrentPositive && 'text-green-700',
                        !flash && !isCurrentPositive && 'text-red-700',
                    )}
                >
                    {formatValue(asset.currentValue)}
                </span>
            </div>
        </div>
    )
}

export default AssetCard
