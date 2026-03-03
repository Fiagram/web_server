import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox';

const Home = () => {
    const loggedIn = { firstName: "thaivd" };

    return (
        <section className="flex w-full flex-row">
            <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-7 lg:py-12 xl:max-h-screen xl:overflow-y-scroll">
                <header className="flex flex-col justify-between gap-8">
                    <HeaderBox
                        type="greeting"
                        title="Welcome"
                        user={loggedIn?.firstName || "Guest"}
                        subtext="Manage transactions efficiently with Fiagram"
                    />

                    <TotalBalanceBox
                        accounts={[
                            {
                                id: "acc_001",
                                availableBalance: 2500.50,
                                currentBalance: 2500.50,
                                officialName: "Chase Checking Account",
                                mask: "1234",
                                institutionId: "ins_chase",
                                name: "Chase Checking",
                                type: "depository",
                                subtype: "checking",
                                appwriteItemId: "item_001",
                                shareableId: "share_001"
                            },
                            {
                                id: "acc_002",
                                availableBalance: 1850.75,
                                currentBalance: 1850.75,
                                officialName: "Bank of America Savings",
                                mask: "5678",
                                institutionId: "ins_bofa",
                                name: "BofA Savings",
                                type: "depository",
                                subtype: "savings",
                                appwriteItemId: "item_002",
                                shareableId: "share_002"
                            },
                            {
                                id: "acc_003",
                                availableBalance: 500.00,
                                currentBalance: 500.00,
                                officialName: "Wells Fargo Credit Card",
                                mask: "9012",
                                institutionId: "ins_wellsfargo",
                                name: "Wells Fargo CC",
                                type: "credit",
                                subtype: "credit card",
                                appwriteItemId: "item_003",
                                shareableId: "share_003"
                            },
                            {
                                id: "acc_004",
                                availableBalance: 50000.00,
                                currentBalance: 50000.00,
                                officialName: "Vanguard Investment Account",
                                mask: "3456",
                                institutionId: "ins_vanguard",
                                name: "Vanguard Investment",
                                type: "investment",
                                subtype: "brokerage",
                                appwriteItemId: "item_004",
                                shareableId: "share_004"
                            },
                            {
                                id: "acc_005",
                                availableBalance: -5000.00,
                                currentBalance: -5000.00,
                                officialName: "Student Loan Account",
                                mask: "7890",
                                institutionId: "ins_fedloan",
                                name: "Federal Student Loan",
                                type: "loan",
                                subtype: "student",
                                appwriteItemId: "item_005",
                                shareableId: "share_005"
                            }
                        ]}
                        totalBanks={2}
                        totalCurrentBalance={5401.02}
                    />
                </header>
            </div>
        </section>
    )
}

export default Home