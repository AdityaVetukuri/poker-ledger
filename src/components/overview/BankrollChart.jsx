import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { fmtMoney } from "../../lib/stats";

const GOLD = "#c9a24b";
const IVORY_DIM = "rgba(244,239,226,0.58)";
const GRID_LINE = "rgba(244,239,226,0.14)";

export default function BankrollChart({ cumulative }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, "rgba(102,189,144,0.45)");
    gradient.addColorStop(1, "rgba(102,189,144,0.02)");

    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: cumulative.map((c) => c.label),
        datasets: [
          {
            data: cumulative.map((c) => c.cumulative),
            borderColor: GOLD,
            backgroundColor: gradient,
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            borderWidth: 2,
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
      <h2>Bankroll over time</h2>
      <div className="pl-chart-wrap">
        <canvas ref={canvasRef} height="90" />
      </div>
    </section>
  );
}
