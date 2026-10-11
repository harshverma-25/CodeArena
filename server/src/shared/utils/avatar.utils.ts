/**
 * Generates a self-contained, offline-resilient inline SVG avatar Data URI.
 * Zero external network requests, zero third-party CDN reliance, and zero privacy leakage.
 */
export function generateLocalSvgAvatar(seed: string): string {
  const themes = [
    { bg: '#FFE600', text: '#18181B' }, // Neon Yellow
    { bg: '#2DD4BF', text: '#18181B' }, // Mint Teal
    { bg: '#FB923C', text: '#18181B' }, // Tangerine
    { bg: '#F472B6', text: '#18181B' }, // Bubblegum Pink
    { bg: '#38BDF8', text: '#18181B' }, // Sky Blue
    { bg: '#A78BFA', text: '#18181B' }, // Lavender
  ];

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const theme = themes[Math.abs(hash) % themes.length];
  const initial = (seed.replace(/^guest_/i, '').charAt(0) || 'P').toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><circle cx="40" cy="40" r="38" fill="${theme.bg}" stroke="#18181B" stroke-width="4"/><text x="40" y="52" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="${theme.text}" text-anchor="middle">${initial}</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
