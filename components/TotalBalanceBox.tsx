import AnimatedCounter from './AnimatedCounter';
import DoughnutChart from './charts/DoughnutChart';

const TotalBalanceBox = ({ portfolio }: { portfolio: Portfolio }) => {
  return (
    <section className="flex w-full items-center gap-5 rounded-xl 
            border border-gray-100 p-4 shadow-chart sm:gap-6 sm:p-6">
      <div className="flex size-full max-w-25 items-center sm:max-w-30">
        <DoughnutChart portfolio={portfolio} />
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-18 font-semibold text-gray-900">
          Assets: {portfolio.totalAssets}
        </h2>
        <div className="flex flex-col gap-2">
          <p className="text-14 font-medium text-gray-600">
            Total Current Balance
          </p>

          <div className="text-24 lg:text-30 flex-1 font-semibold text-gray-900 flex-center gap-2">
            <AnimatedCounter amount={portfolio.totalCurrentBalance} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TotalBalanceBox