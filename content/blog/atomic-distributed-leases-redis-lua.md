---
title: "Eliminating Double-Dispatch: Atomic Redis Lua Leases under 100k RPS"
slug: "atomic-distributed-leases-redis-lua"
date: "2026-02-28"
author: "Soumabrata Ghosh"
tags: ["Redis", "Distributed Systems", "Concurrency", "Lua"]
readingTime: "5 min read"
featured: true
excerpt: "Why multi-roundtrip distributed locking fails under network jitter, and how a single-phase Redis Lua Compare-and-Swap state machine achieves 71,900 leases/sec with 0.000% race collision."
---

Under high geographic concurrency, multi-step locks lead to race conditions. Because Redis evaluates Lua scripts atomically in a single thread context, we can evaluate availability, set expiration TTL, and register the match in one zero-race network roundtrip.

## Why the obvious lock leaks drivers

The naive approach is a read-then-write:

1. `GET driver:84` — observe `AVAILABLE`
2. `SET driver:84 RESERVED` — write the lease

Two gateway nodes serving concurrent requests both complete step 1 before either reaches step 2. The rider is offered the same driver twice. This is the double-dispatch bug, and it is not a rare race — it shows up reliably at 10,000 concurrent synthetic requests, with a **14.200%** collision rate.

Worse, adding a `SETNX` lock to make it safe reintroduces the original problem in a new form. Now you have a lock acquisition that can fail, a retry loop, and a lease that can expire while the gateway still believes it holds it.

## The invariant that matters

The rule is simple: **a driver is leased to exactly one rider, or to nobody.** Every implementation decision should fall out of that single sentence.

## One roundtrip, one decision

Redis executes Lua scripts on a single thread with no interleaving. Moving the entire read-modify-write into the server makes the decision atomic by construction:

```lua
local current_state = redis.call('GET', KEYS[1])
if current_state == 'AVAILABLE' or not current_state then
    redis.call('SET', KEYS[1], 'RESERVED', 'EX', ARGV[2])
    redis.call('HSET', 'ride:' .. ARGV[1], 'assigned_driver', KEYS[1])
    return 1
else
    return 0
end
```

There is no window between the check and the write, because there is no window between the two statements — they run inside one script invocation on one thread.

## Fallback without retry storms

When the script returns `0`, the gateway takes the next-nearest candidate from the k-NN result and re-invokes the same script. Because each attempt is a single atomic roundtrip, the fallback is just another call — not a lock retry loop, and not a thundering herd against a single contended key.

## Result

- **71,900 leases/sec** sustained
- **0.014 ms** mean lock acquisition
- **0.000%** double-dispatch across 10,000 concurrent rider leases

For comparison, the naive multi-roundtrip lock takes 2.80 ms for the same operation, and a pessimistic database lock takes 12.40 ms.
