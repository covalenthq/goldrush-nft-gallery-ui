import React, { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

type BarChartProps = {
  data: number[]
  labels: string[]
  mode: "light" | "dark"
  dataLabel: string
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  labels,
  mode,
  dataLabel,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const rootStyles = getComputedStyle(document.documentElement)
  const barColor =
    mode === "dark"
      ? rootStyles.getPropertyValue("--grk-primary-dark-DEFAULT")
      : rootStyles.getPropertyValue("--grk-primary-light-DEFAULT")

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        const chartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: dataLabel,
                data,
                backgroundColor: barColor,
                borderColor: barColor,
                borderWidth: 1,
                borderRadius: 2,
                barPercentage: 0.7,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: mode === "dark" ? "#444444" : "#dddddd",
                },
              },
            },
          },
        })

        return () => {
          chartInstance.destroy()
        }
      }
    }
  }, [data, labels, barColor, mode])

  return <canvas ref={chartRef} />
}

export default BarChart
