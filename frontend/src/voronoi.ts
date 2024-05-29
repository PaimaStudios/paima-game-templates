import voronoi from 'voronoi-diagram';
import { writeFileSync } from 'fs';
import { cyrb128, sfc32 } from './rng.js';

export function voronoi_svg(seed: string, weights: { [color: string]: number }) {
  const h = 800, w = h * 1.91;

  const points = [];
  const colors = [];
  const rands: Record<string, () => number> = {};

  // Add seed colors
  const baseRand = sfc32(...cyrb128(seed));
  for (let i = 0; i < 3; ++i) {
    let color = '#';
    for (let j = 0; j < 6; ++j) {
      color += '0123456789abcdef'[Math.floor(baseRand() * 16)];
    }
    const rand = rands[color] = sfc32(...cyrb128(seed + color));
    points.push([baseRand() * w, baseRand() * h]);
    colors.push(color);
  }

  // Add weights
  /*
  for (const [color, weight] of Object.entries(weights)) {
    const rand = rands[color] = sfc32(...cyrb128(seed + color));
    for (let i = 0; i < weight * 3; ++i) {
      points.push([rand() * w, rand() * h]);
      colors.push(color);
    }
  }
  */

  points.push([-1 * w, -1 * h], [-1 * w, 2 * h], [2 * w, 2 * h], [2 * w, -1 * h]);

  const { cells, positions } = voronoi(points);

  const output = [];
  output.push('<svg width="', w, '" height="', h, '" xmlns="http://www.w3.org/2000/svg">\n');

  for (let i = 0; i < cells.length; ++i) {
    const cell = cells[i], color = colors[i] ?? "yellow";
    if (cell.indexOf(-1) >= 0) {
      continue;
    }

    output.push('<path d="');
    output.push('M ', positions[cell[0]][0], ' ', positions[cell[0]][1], ' ');
    for (let j = 1; j < cell.length; ++j) {
      output.push('L ', positions[cell[j]][0], ' ', positions[cell[j]][1], ' ' );
    }
    output.push('Z');

    // Wiggle the RGB values +/- 10% for additional variety.
    const randomness = 0.2;
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);
    r *= (1 - randomness + rands[color]() * randomness * 2);
    g *= (1 - randomness + rands[color]() * randomness * 2);
    b *= (1 - randomness + rands[color]() * randomness * 2);
    const colorMod = ['rgb(', r, ',', g, ',', b, ')'].join('');

    output.push('" fill="', colorMod, '" stroke="', colorMod, '" stroke-width="0.5"/>\n');
  }

  output.push('</svg>');

  writeFileSync('static/output.svg', output.join(''));
}
