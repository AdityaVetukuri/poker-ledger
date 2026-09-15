import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { fmtMoney } from "../../lib/stats";

const WIN = "#66bd90";
const LOSS = "#d0685c";
const IVORY_DIM = "rgba(244,239,226,0.58)";
const GRID_LINE = "rgba(244,239,226,0.14)";

export default function TiltChart({ tiltBuckets }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const rated = tiltBuckets.filter((b) => b.count > 0);

  useEffect(() => {
    if (!canvasRef.current || !rated.length) return;
    const ctx = canvasRef.current.getContext("2d");
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: rated.map((b) => `${b.rating}/5 (${b.count})`),
        datasets: [
          {
            data: rated.map((b) => b.avgAmount),
            backgroundColor: rated.map((b) => (b.avgAmount >= 0 ? WIN : LOSS)),
            borderRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (c) => ` ${fmtMoney(c.parsed.y, true)} avg` },
            backgroundColor: "#17493a",
            borderColor: "rgba(201,162,75,0.4)",
            borderWidth: 1,
          },
        },
        scales: {
          x: { ticks: { color: IVORY_DIM, font: { family: "IBM Plex Mono", size: 11 } }, grid: { color: "transparent" } },
          y: {
            ticks: { color: IVORY_DIM, font: { family: "IBM Plex Mono", size: 11 }, callback: (v) => "$" + v.toLocaleString() },
            grid: { color: GRID_LINE },
          },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [rated]);

  return (
    <section className="pl-panel">
      <h2>Mental game vs. result</h2>
      <p className="pl-panel-sub">Average session result at each mental-game rating you logged in the reflection wizard.</p>
      {rated.length ? (
        <div className="pl-chart-wrap">
          <canvas ref={canvasRef} height="80" />
        </div>
      ) : (
        <p className="pl-empty">Rate your mental game in the reflection wizard to unlock this chart.</p>
      )}
    </section>
  );
}
