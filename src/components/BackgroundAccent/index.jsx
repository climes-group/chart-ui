/**
 * BackgroundAccent — three SVG fractal triangle background variants.
 *
 * All variants:
 *   - anchor to the bottom-right corner (preserveAspectRatio xMaxYMax slice)
 *   - use moss-primary (#345800) and golden-accent (#e2b046) at low opacity
 *   - are pointer-events:none (except Crystalline which enables hover)
 *   - sit at z-index 1, above the page-bg div (z-0), below main content (z-2)
 *
 * Export the chosen variant as the default export once a design is picked.
 */

import { useMemo } from "react";

const MOSS = "#345800";
const GOLD = "#e2b046";
const VW = 1600;
const VH = 900;

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT A — Tessellation
// Dense right-triangle grid radiating from the bottom-right corner.
// Triangles get progressively lighter toward the top-left.
// Animation: concentric "sonar" rings pulse outward from the corner.
// Hover: gold radial spotlight follows the cursor — implemented via direct
//   SVG attribute mutation (no React re-render on every mousemove).
// ─────────────────────────────────────────────────────────────────────────────
export function TessellationAccent() {

  const tris = useMemo(() => {
    const S = 54; // tile side length in px
    const cols = Math.ceil(VW / S);
    const rows = Math.ceil(VH / S);
    const maxDist = Math.sqrt((cols * 0.6) ** 2 + (rows * 0.7) ** 2);
    const result = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const dist = Math.sqrt(c * c + r * r);
        // Steep falloff — only bottom-right quadrant has meaningful opacity
        const base = 0.092 * Math.max(0, 1 - dist / maxDist) ** 1.6;
        if (base < 0.004) continue;

        // Cell coordinates (measured from bottom-right)
        const x = VW - (c + 1) * S;
        const y = VH - (r + 1) * S;
        const x2 = x + S;
        const y2 = y + S;
        const ring = Math.round(dist * 1.4); // animation ring index

        // Alternate the diagonal cut direction for a woven texture
        if ((c + r) % 2 === 0) {
          result.push({ id: `A${r}-${c}a`, pts: `${x2},${y} ${x2},${y2} ${x},${y2}`, fill: MOSS, a: base, ring });
          result.push({ id: `A${r}-${c}b`, pts: `${x},${y} ${x2},${y} ${x},${y2}`, fill: (r + c) % 7 === 0 ? GOLD : MOSS, a: base * 0.48, ring });
        } else {
          result.push({ id: `A${r}-${c}a`, pts: `${x},${y} ${x2},${y} ${x2},${y2}`, fill: MOSS, a: base, ring });
          result.push({ id: `A${r}-${c}b`, pts: `${x},${y} ${x},${y2} ${x2},${y2}`, fill: (r + c) % 11 === 0 ? GOLD : MOSS, a: base * 0.48, ring });
        }
      }
    }
    return result;
  }, []);

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="fixed inset-0 w-full h-full pointer-events-none select-none"
      preserveAspectRatio="xMaxYMax slice"
      aria-hidden="true"
      style={{ zIndex: 1 }}
    >
      <defs>
        <style>{`
          @keyframes tess-sonar {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.2; }
          }
        `}</style>

      </defs>

      {tris.map((t) => (
        <polygon
          key={t.id}
          points={t.pts}
          fill={t.fill}
          fillOpacity={t.a}
          style={{
            animation: `tess-sonar ${5 + (t.ring % 5)}s ease-in-out infinite`,
            animationDelay: `${(t.ring * 0.19) % 7}s`,
          }}
        />
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT B — Fractal Branches
// A recursive binary tree of right triangles (Pythagoras-tree structure).
// Two root branches grow from the corner, each splitting into 2 children
// up to 6 levels deep (≈ 126 triangles). Leaves are gold; trunk is moss.
// Animation: each generation pulses at its own pace, creating a slow "breathe".
// ─────────────────────────────────────────────────────────────────────────────

function buildBranch(ax, ay, bx, by, depth, maxDepth, acc = []) {
  if (depth > maxDepth) return acc;

  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 4) return acc;

  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;

  // Perpendicular unit vector (two choices: ±)
  const pxA = -dy / len;
  const pyA = dx / len;

  // Pick the direction pointing generally toward the viewport interior (top-left)
  const toTLx = VW * 0.15 - mx;
  const toTLy = VH * 0.15 - my;
  const dot = pxA * toTLx + pyA * toTLy;
  const px = dot >= 0 ? pxA : -pxA;
  const py = dot >= 0 ? pyA : -pyA;

  // Apex of this triangle (isoceles, height ≈ 0.7× base)
  const cx = mx + px * len * 0.7;
  const cy = my + py * len * 0.7;

  // Steeper alpha falloff — deeper generations fade out much more quickly
  const alpha = Math.max(0.012, 0.09 - depth * 0.014);
  const isLeaf = depth >= maxDepth - 1;

  acc.push({
    id: `B${depth}-${Math.round(ax)}-${Math.round(ay)}`,
    pts: `${ax.toFixed(1)},${ay.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)} ${cx.toFixed(1)},${cy.toFixed(1)}`,
    fill: isLeaf ? GOLD : MOSS,
    alpha,
    depth,
  });

  if (depth < maxDepth) {
    buildBranch(cx, cy, ax, ay, depth + 1, maxDepth, acc);
    buildBranch(bx, by, cx, cy, depth + 1, maxDepth, acc);
  }

  return acc;
}

export function FractalBranchAccent() {
  const tris = useMemo(() => {
    // Shorter root arms (180 vs 270) → tighter footprint near the corner.
    // Depth 5 instead of 6 → ~half the triangle count (62 vs 126 per root).
    const L = 180;
    const r1 = buildBranch(VW - L, VH,     VW, VH, 0, 5);
    const r2 = buildBranch(VW,     VH - L, VW, VH, 0, 5);
    return [...r1, ...r2];
  }, []);

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="fixed inset-0 w-full h-full pointer-events-none select-none"
      preserveAspectRatio="xMaxYMax slice"
      aria-hidden="true"
      style={{ zIndex: 1 }}
    >
      <defs>
        <style>{`
          @keyframes branch-breathe {
            0%, 100% { fill-opacity: var(--ba); }
            50%       { fill-opacity: calc(var(--ba) * 1.4); }
          }
        `}</style>
      </defs>
      {tris.map((t) => (
        <polygon
          key={t.id}
          points={t.pts}
          fill={t.fill}
          fillOpacity={t.alpha}
          style={{
            "--ba": t.alpha,
            // Slower, gentler breathe — deeper leaves cycle more slowly
            animation: `branch-breathe ${7 + t.depth * 1.5}s ease-in-out infinite`,
            animationDelay: `${(t.depth * 0.7) % 6}s`,
          }}
        />
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT C — Crystalline Shards
// Sparse, large triangular "crystal" facets at three size tiers.
// Each shard is a primary triangle + a smaller companion forming a facet pair.
// Hover-interactive: hovering a crystal group increases its brightness.
// Animation: each shard shimmers independently (slow, out-of-phase oscillations).
// ─────────────────────────────────────────────────────────────────────────────

// [cx, cy, size, rotDeg, color, baseAlpha, animDur, animDelay]
const SHARDS = [
  // Large anchors — right at the corner
  [1550, 890, 230, 12,   MOSS, 0.08, 7.0, 0.0],
  [1395, 860, 195, -18,  MOSS, 0.05, 6.2, 1.3],
  [1525, 680, 160, 38,   GOLD, 0.07, 5.5, 0.5],
  // Medium — mid-range
  [1285, 770, 170, 6,    MOSS, 0.045, 8.0, 2.2],
  [1445, 535, 145, -32,  MOSS, 0.055, 5.0, 0.9],
  [1205, 860, 135, 22,   GOLD, 0.07,  6.5, 1.6],
  [1365, 425, 150, 52,   MOSS, 0.04,  7.5, 0.4],
  [1145, 700, 115, -8,   MOSS, 0.05,  6.0, 2.0],
  [1490, 355, 105, 28,   GOLD, 0.065, 4.5, 0.7],
  // Small accents — further into the viewport
  [1080, 575, 115, 42,   MOSS, 0.03,  8.0, 2.5],
  [1315, 310, 90,  -42,  MOSS, 0.04,  5.5, 1.2],
  [1000, 795, 100, 0,    MOSS, 0.04,  7.0, 1.0],
  [1255, 475, 80,  58,   GOLD, 0.05,  6.0, 1.8],
  [ 955, 650, 105, -18,  MOSS, 0.03,  5.0, 2.7],
  [1185, 360, 85,  33,   MOSS, 0.035, 6.5, 1.4],
  [ 900, 515, 75,  -28,  GOLD, 0.04,  7.0, 0.6],
];

function equilateralPts(cx, cy, size, rotDeg) {
  const rad = (rotDeg * Math.PI) / 180;
  const R = size / Math.sqrt(3); // circumradius for equilateral triangle
  return [0, 1, 2]
    .map((i) => {
      const θ = rad + (i * 2 * Math.PI) / 3;
      return `${(cx + R * Math.cos(θ)).toFixed(1)},${(cy + R * Math.sin(θ)).toFixed(1)}`;
    })
    .join(" ");
}

export function CrystallineAccent() {
  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="fixed inset-0 w-full h-full"
      preserveAspectRatio="xMaxYMax slice"
      aria-hidden="true"
      style={{ zIndex: 1, pointerEvents: "none" }}
    >
      <defs>
        <style>{`
          @keyframes crystal-shimmer {
            0%   { fill-opacity: var(--ca); }
            38%  { fill-opacity: calc(var(--ca) * 0.45); }
            72%  { fill-opacity: calc(var(--ca) * 1.75); }
            100% { fill-opacity: var(--ca); }
          }
          .crystal-group { pointer-events: all; cursor: default; }
          .crystal-group:hover .crystal-face {
            fill-opacity: calc(var(--ca) * 3.5) !important;
            transition: fill-opacity 0.35s ease;
          }
        `}</style>
      </defs>
      {SHARDS.map(([cx, cy, s, rot, color, alpha, dur, delay], i) => {
        const mainPts = equilateralPts(cx, cy, s, rot);
        // Companion: smaller, offset, inverted rotation — creates the "facet" pair
        const compPts = equilateralPts(cx - s * 0.26, cy - s * 0.32, s * 0.5, rot + 180);
        const compColor = color === MOSS ? GOLD : MOSS;

        return (
          <g key={i} className="crystal-group">
            <polygon
              className="crystal-face"
              points={mainPts}
              fill={color}
              fillOpacity={alpha}
              style={{
                "--ca": alpha,
                animation: `crystal-shimmer ${dur}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            />
            <polygon
              className="crystal-face"
              points={compPts}
              fill={compColor}
              fillOpacity={alpha * 0.6}
              style={{
                "--ca": alpha * 0.6,
                animation: `crystal-shimmer ${dur + 1.2}s ease-in-out infinite`,
                animationDelay: `${delay + 0.6}s`,
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export — swap to your chosen variant after reviewing
// ─────────────────────────────────────────────────────────────────────────────
export { TessellationAccent as default };
