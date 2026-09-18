import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchPublicRead } from "../src/lib/fetch-public-read.ts";

const url = "https://api.example.test/packages?page=2";
const fastRetries = { retryDelayMs: 0 };

test("successful responses retain headers, caching and redirect URLs", async (t) => {
  const response = Response.json({ data: [] });
  Object.defineProperty(response, "url", { value: `${url}&redirected=true` });
  const fetchMock = t.mock.method(globalThis, "fetch", async () => response);
  const init = { headers: { accept: "application/json" }, next: { revalidate: 30 } };
  assert.equal(await fetchPublicRead(url, init), response);
  assert.equal(response.url, `${url}&redirected=true`);
  assert.equal(fetchMock.mock.callCount(), 1);
  const [requestedUrl, options] = fetchMock.mock.calls[0].arguments;
  assert.equal(requestedUrl, url);
  assert.deepEqual(options.next, { revalidate: 30 });
  assert.deepEqual(options.headers, init.headers);
  assert.equal(options.method, "GET");
  assert.ok(options.signal instanceof AbortSignal);
});

for (const status of [408, 500, 502, 503, 504]) {
  test(`recovers from HTTP ${status} before showing a page error`, async (t) => {
    const failure = Response.json({ error: "Temporary failure" }, { status });
    const success = Response.json({ data: ["package"] });
    const fetchMock = t.mock.method(globalThis, "fetch", async () =>
      fetchMock.mock.callCount() === 0 ? failure : success,
    );
    assert.equal(await fetchPublicRead(url, { cache: "no-store" }, fastRetries), success);
    assert.equal(fetchMock.mock.callCount(), 2);
    const [first, second] = fetchMock.mock.calls.map((call) => call.arguments[1]);
    assert.notEqual(first.signal, second.signal);
    assert.equal(second.cache, "no-store");
    assert.equal(failure.bodyUsed, true);
  });
}

test("network failures are retried", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", async () => {
    if (fetchMock.mock.callCount() === 0) throw new TypeError("fetch failed");
    return Response.json({ data: [] });
  });
  assert.equal((await fetchPublicRead(url, {}, fastRetries)).status, 200);
  assert.equal(fetchMock.mock.callCount(), 2);
});

test("persistent server failure stops at three attempts with its error body intact", async (t) => {
  const payload = { error: { code: "INTERNAL_ERROR", requestId: "test-request" } };
  const fetchMock = t.mock.method(globalThis, "fetch", async () =>
    Response.json(payload, { status: 500 }),
  );
  const response = await fetchPublicRead(url, {}, fastRetries);
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), payload);
  assert.equal(fetchMock.mock.callCount(), 3);
});

for (const status of [400, 401, 403, 404, 422, 429]) {
  test(`HTTP ${status} is returned without retrying`, async (t) => {
    const fetchMock = t.mock.method(globalThis, "fetch", async () =>
      Response.json({ error: "Not retryable" }, { status }),
    );
    assert.equal((await fetchPublicRead(url, {}, fastRetries)).status, status);
    assert.equal(fetchMock.mock.callCount(), 1);
  });
}

test("timeouts cancel each request and stop after three attempts", async (t) => {
  // AbortSignal.timeout uses unreferenced timers; keep this isolated test alive.
  const keepAlive = setInterval(() => {}, 100);
  t.after(() => clearInterval(keepAlive));
  const signals = [];
  const fetchMock = t.mock.method(globalThis, "fetch", async (_url, { signal }) => {
    signals.push(signal);
    return new Promise((_resolve, reject) => {
      signal.addEventListener("abort", () => reject(signal.reason), { once: true });
    });
  });
  await assert.rejects(
    fetchPublicRead(url, {}, { attemptTimeoutMs: 20, retryDelayMs: 0 }),
    { name: "TimeoutError" },
  );
  assert.equal(fetchMock.mock.callCount(), 3);
  assert.ok(signals.every((signal) => signal.aborted));
  assert.equal(new Set(signals).size, 3);
});

test("non-network errors are not retried", async (t) => {
  const error = new Error("Render interrupted");
  const fetchMock = t.mock.method(globalThis, "fetch", async () => { throw error; });
  await assert.rejects(fetchPublicRead(url, {}, fastRetries), (caught) => caught === error);
  assert.equal(fetchMock.mock.callCount(), 1);
});

test("mutating requests are rejected without sending them", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", async () => Response.json({}));
  for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
    await assert.rejects(fetchPublicRead(url, { method }, fastRetries), /must use GET/);
  }
  await assert.rejects(fetchPublicRead(url, { body: "booking" }, fastRetries), /must use GET/);
  assert.equal(fetchMock.mock.callCount(), 0);
});
