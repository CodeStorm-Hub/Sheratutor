/**
 * Start of "today" in Asia/Dhaka (UTC+6, no DST), as a UTC ISO string.
 * Used for per-day rate-limit windows so the reset lands at local midnight.
 */
export function startOfDhakaDayUtcIso(): string {
  const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;
  const dhakaNow = new Date(Date.now() + DHAKA_OFFSET_MS);
  const dhakaMidnight = Date.UTC(
    dhakaNow.getUTCFullYear(),
    dhakaNow.getUTCMonth(),
    dhakaNow.getUTCDate(),
  );
  return new Date(dhakaMidnight - DHAKA_OFFSET_MS).toISOString();
}
