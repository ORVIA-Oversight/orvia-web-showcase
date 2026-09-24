"use client";

import { Artwork } from "../lib/demo";

const palettes = [
  ["#d8d6cf", "#65777b", "#33383a", "#9e7652", "#ece8df"],
  ["#c9c8c1", "#879698", "#4d5552", "#aa7954", "#ede9e0"],
  ["#ddd8cf", "#71878b", "#273234", "#b58b67", "#f1eee8"],
  ["#cfcac0", "#5f7379", "#4d4a43", "#8f6b4d", "#e8e4dc"],
  ["#e5e1d9", "#789094", "#343b3d", "#a97149", "#f4f1ea"]
];

function seeded(seed: number, offset: number) {
  const x = Math.sin(seed * 999 + offset * 77) * 10000;
  return x - Math.floor(x);
}

export default function ArtVisual({ artwork, className = "" }: { artwork: Artwork; className?: string }) {
  if (artwork.imageData) {
    return <img className={`art-visual uploaded ${className}`} src={artwork.imageData} alt={artwork.alt} />;
  }

  const palette = palettes[artwork.seed % palettes.length];
  const horizon = 42 + Math.round(seeded(artwork.seed, 1) * 20);
  const ridge = 38 + Math.round(seeded(artwork.seed, 2) * 22);
  const sunX = 18 + Math.round(seeded(artwork.seed, 3) * 64);
  const sunY = 18 + Math.round(seeded(artwork.seed, 4) * 30);
  const id = `paint-${artwork.id.replace(/[^a-z0-9]/gi, "")}`;
  const viewBox = artwork.aspect === "portrait" ? "0 0 800 1000" : artwork.aspect === "square" ? "0 0 900 900" : "0 0 1100 760";
  const height = artwork.aspect === "portrait" ? 1000 : artwork.aspect === "square" ? 900 : 760;
  const width = artwork.aspect === "portrait" ? 800 : artwork.aspect === "square" ? 900 : 1100;

  return (
    <svg className={`art-visual ${className}`} viewBox={viewBox} role="img" aria-label={artwork.alt} preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id={`${id}-paper`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.014 0.045" numOctaves="3" seed={artwork.seed} result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0" result="grey" />
          <feBlend in="SourceGraphic" in2="grey" mode="multiply" />
        </filter>
        <filter id={`${id}-soft`}>
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor={palette[4]} />
          <stop offset="0.5" stopColor={palette[0]} />
          <stop offset="1" stopColor={palette[1]} />
        </linearGradient>
      </defs>
      <rect width={width} height={height} fill={`url(#${id}-sky)`} />
      <rect y={height * (horizon / 100)} width={width} height={height} fill={palette[2]} opacity="0.84" />
      <path
        d={`M0 ${height * (ridge / 100)} C ${width * .18} ${height * ((ridge - 8) / 100)}, ${width * .28} ${height * ((ridge + 9) / 100)}, ${width * .45} ${height * ((ridge + 2) / 100)} S ${width * .78} ${height * ((ridge - 4) / 100)}, ${width} ${height * ((ridge + 5) / 100)} L ${width} ${height * .67} L0 ${height * .66} Z`}
        fill={palette[1]}
        opacity="0.8"
      />
      <ellipse cx={width * (sunX / 100)} cy={height * (sunY / 100)} rx={width * .12} ry={height * .08} fill={palette[3]} opacity="0.22" filter={`url(#${id}-soft)`} />
      <path d={`M0 ${height * .71} C ${width * .18} ${height * .66}, ${width * .34} ${height * .82}, ${width * .57} ${height * .74} S ${width * .82} ${height * .62}, ${width} ${height * .73}`} fill="none" stroke={palette[3]} strokeWidth={12 + artwork.seed % 9} opacity="0.5" />
      <path d={`M0 ${height * .82} C ${width * .22} ${height * .76}, ${width * .37} ${height * .91}, ${width * .61} ${height * .84} S ${width * .79} ${height * .77}, ${width} ${height * .86}`} fill="none" stroke={palette[0]} strokeWidth={28 + artwork.seed % 13} opacity="0.32" />
      <g opacity="0.28">
        {Array.from({ length: 12 }).map((_, i) => {
          const y = height * (.55 + i * .032);
          const x1 = width * seeded(artwork.seed, i + 10) * .45;
          const x2 = width * (.58 + seeded(artwork.seed, i + 30) * .4);
          return <line key={i} x1={x1} y1={y} x2={x2} y2={y + (i % 3) * 9} stroke={i % 2 ? palette[4] : palette[3]} strokeWidth={2 + (i % 4)} />;
        })}
      </g>
      <rect width={width} height={height} fill="transparent" filter={`url(#${id}-paper)`} opacity="0.23" />
    </svg>
  );
}
