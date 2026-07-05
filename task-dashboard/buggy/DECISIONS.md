Bug 1:
Root cause: useEffect interval used stale state value of tick.
Fix: used functional state update setTick(t => t + 1).
Why correct: ensures latest state is always used inside async interval callback.

Bug 2:
Root cause: state array was mutated using push.
Fix: used immutable update [...prev, t].
Why correct: React requires immutable state updates for re-rendering.

Bug 3:
Root cause: API called even when selectedId was null.
Fix: added guard clause if (!selectedId) return.
Why correct: prevents invalid network requests.

Bug 4:
Root cause: array was sorted in-place using sort().
Fix: copied array before sorting [...tasks].
Why correct: avoids mutating React state directly and prevents UI bugs.