/**
 * Minimal QR code URL generator.
 * Uses the free QR Server API via a URL — the frontend fetches it as an <img> src.
 * No external npm package needed; just constructs the URL.
 */
export function getQRCodeUrl(workerId: string, baseUrl?: string): string {
  const origin = baseUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const profileUrl = `${origin}/worker/${workerId}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`;
}

export function getWorkerProfileUrl(workerId: string, baseUrl?: string): string {
  const origin = baseUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${origin}/worker/${workerId}`;
}
