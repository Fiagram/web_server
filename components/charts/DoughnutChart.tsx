"use client"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);



const DoughnutChart = ({ portfolio }: { portfolio: Portfolio }) => {
  const accountNames = portfolio.assets.map((a) => a.name);
  const balances = portfolio.assets.map((a) => a.currentBalance)

  const data = {
    datasets: [
      {
        label: 'Banks',
        data: balances,
        backgroundColor: ['#0747b6', '#2265d8', '#2f91fa']
      }
    ],
    labels: accountNames
  }

  return <Doughnut
    data={data}
    options={{
      cutout: '50%',
      plugins: {
        legend: {
          display: false
        }
      }
    }}
  />
}

export default DoughnutChart