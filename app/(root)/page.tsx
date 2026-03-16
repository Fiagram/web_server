import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox';

const Home = () => {
    const examplePortfolio: Portfolio = {
        assets: [
            {
                name: "Apple Stock",
                currentBalance: 5000
            },
            {
                name: "Bitcoin",
                currentBalance: 12000
            },
            {
                name: "Savings Account",
                currentBalance: 8500
            }
        ],
        totalAssets: 3,
        totalCurrentBalance: 25500
    };

    return (
        <section className="flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll">
            <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-7 lg:py-12 xl:max-h-screen xl:overflow-y-scroll">
                <header className="flex flex-col justify-between gap-8">
                    <HeaderBox
                        title="Welcome"
                        subtext="Manage transactions efficiently with Fiagram"
                    />

                    <TotalBalanceBox
                        portfolio={examplePortfolio}
                    />
                </header>
            </div>
        </section>
    )
}

export default Home