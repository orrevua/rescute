/**
 * Placeholder backgrounds for cats without photos. Each variant keeps the
 * house style (soft radial highlight over a pastel diagonal gradient) in a
 * different hue, and the pick is a stable hash of the cat's id/name so the
 * same cat always gets the same color while neighbors differ.
 */
const PLACEHOLDER_GRADIENTS = [
  // Teal (original)
  'radial-gradient(circle at 35% 30%, #fef3c7 0, transparent 30%), linear-gradient(135deg, #b8d9d0, #e7f0ed)',
  // Peach
  'radial-gradient(circle at 35% 30%, #d1f0e8 0, transparent 30%), linear-gradient(135deg, #fcd9a8, #fdf0dc)',
  // Rose
  'radial-gradient(circle at 35% 30%, #fef3c7 0, transparent 30%), linear-gradient(135deg, #f3c6c6, #fbe9e7)',
  // Lavender
  'radial-gradient(circle at 35% 30%, #fde8c8 0, transparent 30%), linear-gradient(135deg, #cfc6ec, #efeafa)',
  // Sage
  'radial-gradient(circle at 35% 30%, #fee9c7 0, transparent 30%), linear-gradient(135deg, #cfe3b8, #eff5e3)',
  // Sky
  'radial-gradient(circle at 35% 30%, #ffe4c7 0, transparent 30%), linear-gradient(135deg, #b8cfe3, #e7eef5)',
];

export function placeholderGradient(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return PLACEHOLDER_GRADIENTS[hash % PLACEHOLDER_GRADIENTS.length];
}
