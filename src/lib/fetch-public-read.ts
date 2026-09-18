type PublicReadInit = Omit<RequestInit, "method" | "body" | "signal"> & {
  method?: "GET";
  body?: never;
  signal?: never;
};

const retryableStatuses = new Set([408, 500, 502, 503, 504]);
const maxAttempts = 3;

/** Retry only public GETs; never reuse this for bookings or admin writes. */
export async function fetchPublicRead(
  url: string,
  init: PublicReadInit = {},
  { attemptTimeoutMs = 8_000, retryDelayMs = 250 } = {},
): Promise<Response> {
  if ((init.method && init.method !== "GET") || init.body !== undefined) {
    throw new TypeError("Public reads must use GET without a request body.");
  }

  // At most three attempts: under 25 seconds with the default timeouts/backoff.
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const lastAttempt = attempt === maxAttempts - 1;
    try {
      const response = await fetch(url, {
        ...init,
        method: "GET",
        // A fresh signal also prevents Next from memoizing a failed attempt.
        // Keep the caller's successful-response caching/revalidation policy.
        signal: AbortSignal.timeout(attemptTimeoutMs),
      });
      if (!retryableStatuses.has(response.status) || lastAttempt) {
        return response;
      }
      await response.body?.cancel().catch(() => undefined);
    } catch (error) {
      const transient =
        error instanceof TypeError ||
        (error instanceof Error && error.name === "TimeoutError");
      if (!transient || lastAttempt) throw error;
    }
    await new Promise((resolve) =>
      setTimeout(resolve, retryDelayMs * 2 ** attempt),
    );
  }
  throw new Error("Public read attempts exhausted.");
}
