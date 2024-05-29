import colors_json from './colorlist.json' with { type: 'json' };

const colors: Record<string, string> = colors_json;
const entries = Object.entries(colors);

export function closest_color(input: string): { name: string, color: string, distance: number } {
  input = input.toLowerCase();

  if (colors[input]) {
    return { name: input, color: colors[input], distance: 0 };
  }

  let best = { name: entries[0][0], color: entries[0][1], distance: levenshtein(input, entries[0][0]) };
  for (let i = 1; i < entries.length; ++i) {
    const distance = levenshtein(input, entries[i][0].toLowerCase());
    if (distance < best.distance || (distance == best.distance && Math.random() > 0.7)) {
      best = { name: entries[i][0], color: entries[i][1], distance };
    }
    if (distance <= 1) {
      break;
    }
  }
  return best;
}

// https://en.wikipedia.org/wiki/Levenshtein_distance#Iterative_with_two_matrix_rows
function levenshtein(s: string, t: string): number {
  const m = s.length;
  const n = t.length;

  let v0 = Array(n + 1);
  let v1 = Array(n + 1);

  for (let i = 0; i <= n; ++i) {
    v0[i] = i;
  }

  for (let i = 0; i < m; ++i) {
    v1[0] = i + 1;

    for (let j = 0; j < n; ++j) {
      const deletionCost = v0[j + 1] + 1;
      const insertionCost = v1[j] + 1;
      const substitutionCost = v0[j] + (s[i] == t[j] ? 0 : 1);
      v1[j + 1] = Math.min(deletionCost, insertionCost, substitutionCost);
    }

    const swap = v0;
    v0 = v1;
    v1 = swap;
  }

  return v0[n];
}
