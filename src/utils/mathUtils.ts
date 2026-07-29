/**
 * Calculate Euclidean distance between two 2D points
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1);
}

/**
 * Clamp a number between min and max bounds
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Generate a random float between min and max
 */
export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
