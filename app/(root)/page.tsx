import HeaderBox from '@/components/HeaderBox'
import FinancialIndicatorsPanel from '@/components/home/FinancialIndicatorsPanel'

const Home = () => {
    return (
        <section className="flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll">
            <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-7 lg:py-12 xl:max-h-screen xl:overflow-y-scroll">
                <header className="flex flex-col justify-between gap-8">
                    <HeaderBox
                        title="Welcome"
                        subtext="Manage transactions efficiently with Fiagram"
                    />
                </header>

                <FinancialIndicatorsPanel />
            </div>
        </section>
    )
}

export default Home