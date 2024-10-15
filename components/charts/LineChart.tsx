import React, { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

type LineChartProps = {
  data: number[]
  labels: string[]
  mode: "light" | "dark"
  dataLabel: string
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  labels,
  mode,
  dataLabel,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const rootStyles = getComputedStyle(document.documentElement)
  const lineColor =
    mode === "dark"
      ? rootStyles.getPropertyValue("--grk-primary-dark-DEFAULT")
      : rootStyles.getPropertyValue("--grk-primary-light-DEFAULT")

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        const chartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: dataLabel,
                data,
                borderColor: lineColor,
                backgroundColor: "transparent",
                borderWidth: 2,
                pointRadius: 0.5,
                tension: 0.4,
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
  }, [data, labels, lineColor, mode])

  return <canvas ref={chartRef} />
}

export default LineChart
