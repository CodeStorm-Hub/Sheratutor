import React from 'react';

export interface BarChartProps {
  data?: number[]; // 7 values for Mon-Sun
}

export const BarChart: React.FC<BarChartProps> = ({ data = [20, 40, 30, 70, 50, 80, 60] }) => {
  // Map data to SVG coordinates
  // SVG viewBox is 570x150. X goes from 0 to 570. Y goes from 150 (bottom) to 0 (top).
  const max = Math.max(...data, 1);
  const min = 0;
  
  const width = 570;
  const height = 120; // Leave 30px for labels at bottom if needed, but we have chart-labels div
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = 140 - ((val - min) / (max - min)) * height;
    return { x, y };
  });

  // Simple bezier curve generator (very rough)
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const ctrl1X = prev.x + (curr.x - prev.x) / 3;
    const ctrl2X = prev.x + 2 * (curr.x - prev.x) / 3;
    d += ` C${ctrl1X},${prev.y} ${ctrl2X},${curr.y} ${curr.x},${curr.y}`;
  }

  const fillD = `${d} L${width},150 L0,150 Z`;

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // Rotate days so today is the last day
  const today = new Date().getDay();
  const adjustedDays = Array.from({length: 7}, (_, i) => {
    const dayIdx = (today + i + 1) % 7;
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIdx];
  });

  return (
    <div className="chart">
      <div className="chart-grid">
        <i />
        <i />
        <i />
        <i />
      </div>
      <svg viewBox="0 0 570 150" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fade" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#23d9a5" stopOpacity=".24" />
            <stop offset="1" stopColor="#23d9a5" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fillD} fill="url(#fade)" />
        <path d={d} fill="none" stroke="#23d9a5" strokeWidth="3" strokeLinecap="round" />
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="5" fill="#fff" stroke="#23d9a5" strokeWidth="3" />
      </svg>
      <div className="chart-labels">
        {adjustedDays.map(d => <span key={d}>{d}</span>)}
      </div>
    </div>
  );
};
