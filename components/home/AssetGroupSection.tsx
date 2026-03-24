'use client'

import AssetCard from './AssetCard'

const AssetGroupSection = ({ group }: { group: IndicatorGroup }) => {
    return (
        <div className="flex flex-col gap-3">
            <h3 className="text-14 font-semibold text-gray-600 uppercase tracking-wide">
                {group.name}
            </h3>
            <div className="flex flex-wrap gap-3">
                {group.assets.map((asset) => (
                    <AssetCard key={asset.symbol} asset={asset} />
                ))}
            </div>
        </div>
    )
}

export default AssetGroupSection
