import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { RANGE_KEYS, seriesForRange, fmtDate } from "../../lib/timeSeries";
import { fmtMoney } from "../../lib/stats";

const WIN = "#66bd90";
const LOSS = "#d0685c";
const GOLD = "#c9a24b";

// Draws a dashed vertical guide + dot at the scrubbed point. Reads the
// active index straight off chart options (mutated imperatively in
// onHover, below) so scrubbing never has to re-create the Chart instance.
const crosshairPlugin = {
  id: "crosshair",
  afterDatasetsDraw(chart) {
    const idx = chart.options.plugins?.crosshair?.index;
    if (idx == null) return;
    const meta = chart.getDatasetMeta(0);
    const point = meta.data[idx];
    if (!point) return;
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "rgba(244,239,226,0.35)";
    ctx.lineWidth = 1;
    ctx.moveTo(point.x, chartArea.top);
    ctx.lineTo(point.x, chartArea.bottom);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.fillStyle = chart.options.plugins.crosshair.color || GOLD;
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};

export default function RobinhoodChart({ series }) {
  const [range, setRange] = useState("ALL");
  const [hover, setHover] = useState(null); // { date, value } | null
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const { points, startValue, endValue, delta } = seriesForRange(series, range);
  const up = delta >= 0;
  const lineColor = up ? WIN : LOSS;

  const displayValue = hover ? hover.value : endValue;
  const displayDelta = hover ? hover.value - startValue : delta;
  const displayUp = displayDelta >= 0;

  useEffect(() => {
    if (!canvasRef.current || !points.length) return;
    const ctx = canvasRef.current.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, up ? "rgba(102,189,144,0.35)" : "rgba(208,104,92,0.35)");
    gradient.addColorStop(1, up ? "rgba(102,189,144,0.02)" : "rgba(208,104,92,0.02)");

    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: points.map((p) => p.date),
        datasets: [
          {
            data: points.map((p) => p.value),
            borderColor: lineColor,
            backgroundColor: gradient,
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 2.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 250 },
        interaction: { mode: "nearest", axis: "x", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
          crosshair: { index: null, color: lineColor },
        },
        scales: {
          x: { display: false, grid: { display: false } },
          y: { display: false, grid: { display: false } },
        },
        onHover: (_evt, elements, chart) => {
          const idx = elements.length ? elements[0].index : null;
          chart.options.plugins.crosshair.index = idx;
          chart.draw();
          setHover(idx != null ? points[idx] : null);
        },
      },
      plugins: [crosshairPlugin],
    });

    return () => chartRef.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, lineColor, up]);

  return (
    <section className="pl-panel pl-rh-panel">
      <div className="pl-rh-header">
        <span className="pl-rh-value">{fmtMoney(displayValue, false)}</span>
        <span className={`pl-rh-delta ${displayUp ? "win" : "loss"}`}>
          {displayUp ? "▲" : "▼"} {fmtMoney(Math.abs(displayDelta), false)}
        </span>
        <span className="pl-rh-period">
          {hover ? fmtDate(hover.date) : range === "ALL" ? "All time" : `Past ${range}`}
        </span>
      </div>

      {points.length ? (
        <div className="pl-rh-chart-wrap">
          <canvas ref={canvasRef} />
        </div>
      ) : (
        <p className="pl-empty">No sessions in this range.</p>
      )}

      <div className="pl-rh-ranges">
        {RANGE_KEYS.map((r) => (
          <button
            key={r}
            type="button"
            className={`pl-rh-range-btn ${range === r ? "active" : ""}`}
            onClick={() => setRange(r)}
          >
            {r}
          </button>
        ))}
      </div>
    </section>
  );
}
