/**
 * Utility for smooth river spline interpolation and high-fidelity hydrography geometry
 */

/**
 * Catmull-Rom spline interpolation between points to create smooth organic river curves
 */
export function interpolateCatmullRomSpline(
  points: [number, number][],
  segmentsPerPoint = 5
): [number, number][] {
  if (points.length < 3) return points;

  const result: [number, number][] = [];
  const n = points.length;

  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(n - 1, i + 2)];

    for (let t = 0; t < segmentsPerPoint; t++) {
      const u = t / segmentsPerPoint;
      const u2 = u * u;
      const u3 = u2 * u;

      // Catmull-Rom basis matrix formulation
      const lat =
        0.5 *
        (2 * p1[0] +
          (-p0[0] + p2[0]) * u +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * u2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * u3);

      const lng =
        0.5 *
        (2 * p1[1] +
          (-p0[1] + p2[1]) * u +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * u2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * u3);

      result.push([lat, lng]);
    }
  }

  // Push the final point
  result.push(points[n - 1]);
  return result;
}

/**
 * Generates an offset parallel line along a polyline to create riverbank or isobath offsets
 */
export function offsetPolyline(
  points: [number, number][],
  offsetDistanceDeg: number
): [number, number][] {
  if (points.length < 2) return points;

  const offsetPoints: [number, number][] = [];

  for (let i = 0; i < points.length; i++) {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];

    // Vector from prev to next
    const dLat = next[0] - prev[0];
    const dLng = next[1] - prev[1];
    const len = Math.hypot(dLat, dLng) || 0.0001;

    // Normal vector perpendicular to flow (pointing to right bank)
    const normLat = -dLng / len;
    const normLng = dLat / len;

    offsetPoints.push([
      points[i][0] + normLat * offsetDistanceDeg,
      points[i][1] + normLng * offsetDistanceDeg,
    ]);
  }

  return offsetPoints;
}
