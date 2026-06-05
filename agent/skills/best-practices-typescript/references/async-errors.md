# Async and Errors

## Promise Basics

Always handle promises. Use `await`, return the promise, or intentionally detach
with an error handler.

```ts
await saveUser(user);
```

Detached work should be explicit:

```ts
void sendTelemetry(event).catch((error) => {
  logger.warn({ error }, "telemetry failed");
});
```

## Parallel Work

Start independent work together:

```ts
const userPromise = fetchUser(id);
const settingsPromise = fetchSettings(id);

const [user, settings] = await Promise.all([userPromise, settingsPromise]);
```

Use sequential `await` when the second operation depends on the first.

## Expected Failures

Use typed result values for expected domain failures:

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

Use exceptions for unexpected failures, infrastructure failures, and APIs that
already throw.

## Catch Variables

Treat caught values as `unknown`:

```ts
try {
  await run();
} catch (error: unknown) {
  logger.error({ message: getErrorMessage(error) });
}
```

Do not assume every thrown value is an `Error`.

## Cancellation and Timeouts

Use `AbortSignal` when APIs support it:

```ts
async function loadUser(id: string, signal?: AbortSignal): Promise<User> {
  const response = await fetch(`/api/users/${id}`, { signal });
  return parseUser(await response.json());
}
```

For long-running work, define what cancellation means and make cleanup explicit.

## Error Messages

Errors should include useful context without leaking secrets:

```ts
throw new Error(`User ${userId} was not found`);
```

Avoid logging tokens, passwords, cookies, full authorization headers, or sensitive
payloads.

## Retries

Retry only idempotent or explicitly safe operations. Use bounded retries with
backoff. Avoid retrying validation errors and permission failures.
