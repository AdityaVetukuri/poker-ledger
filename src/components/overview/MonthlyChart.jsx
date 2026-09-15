import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { fmtMoney } from "../../lib/stats";

const WIN = "#66bd90";
const LOSS = "#d0685c";
const IVORY_DIM = "rgba(244,239,226,0.58)";
const GRID_LINE = "rgba(244,239,226,0.14)";

export default function MonthlyChart({ cumulative }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");

    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: cumulative.map((c) => c.label),
        datasets: [
          {
            data: cumulative.map((c) => c.monthTotal),
            backgroundColor: cumulative.map((c) => (c.monthTotal >= 0 ? WIN : LOSS)),
            borderRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (c) => ` ${fmtMoney(c.parsed.y, true)}` },
            backgroundColor: "#17493a",
            borderColor: "rgba(201,162,75,0.4)",
            borderWidth: 1,
            titleFont: { family: "IBM Plex Mono" },
            bodyFont: { family: "IBM Plex Mono" },
          },
        },
        scales: {
          x: { ticks: { color: IVORY_DIM, font: { family: "IBM Plex Mono", size: 11 } }, grid: { color: "transparent" } },
          y: {
            ticks: {
              color: IVORY_DIM,
              font: { family: "IBM Plex Mono", size: 11 },
              callback: (v) => "$" + v.toLocaleString(),
            },
            grid: { color: GRID_LINE },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [cumulative]);

  return (
    <section className="pl-panel">
      <h2>Result by month</h2>
      <div className="pl-chart-wrap">
        <canvas ref={canvasRef} height="80" />
      </div>
    </section>
  );
}
