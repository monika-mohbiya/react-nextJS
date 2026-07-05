## 1. Key architectural decisions & tradeoffs

I chose Redux Toolkit with Entity Adapter instead of RTK Query because the app required fine-grained control over normalization, caching, and real-time updates. Thunks were used for async fetching to allow custom fallback logic (IndexedDB caching) and explicit control over error handling.

Normalization was implemented as a strict boundary layer between Raw API data and UI-safe domain types. This ensured that all messy and inconsistent API data is cleaned before entering the Redux store. Tradeoff: extra code overhead, but improved safety and predictability across the app.

For real-time updates, WebSocket events directly update Redux state using normalized actions. This avoids re-fetching data but introduces potential race conditions, which were mitigated by keeping updates minimal and id-based.

---

## 2. Secure rendering of streamed markdown

AI-generated streamed content is rendered using react-markdown with rehype-sanitize and remark-gfm. All untrusted markdown content is sanitized at render time to prevent XSS attacks.

Sanitization happens in the rendering layer (SafeMarkdown component), ensuring that even partially streamed or malicious content is never executed as HTML or scripts.

---

## 3. IndexedDB caching strategy

IndexedDB is used to store normalized Task objects only. Cached data is loaded first to provide instant UI rendering, followed by server revalidation.

Cache is treated as a fallback layer, not source of truth. After fetch, fresh server data replaces cached state. This avoids stale UI while still supporting offline-first behavior.

Tradeoff: Slight complexity in sync logic, but improved performance and offline usability.

---

## 4. Handling messy and edge-case data

All API responses are treated as untrusted (RawTask layer). A normalization function ensures:
- type safety (string → enum mapping)
- number parsing for inconsistent fields
- safe fallback values for missing or invalid fields

Deliberately avoided over-validation (like Zod runtime schemas) to keep the implementation lightweight, but basic guards were added for critical fields.

---

## 5. What I would improve next

If more time was available, I would:
- Replace thunks with RTK Query for better caching & request deduplication
- Add Zod-based runtime validation for stronger schema safety
- Improve WebSocket reconciliation logic (diff-based updates instead of direct patching)
- Add optimistic UI updates for better UX
- Add retry/backoff strategy for failed API calls

---

## 6. AI usage disclosure

AI was used for:
- initial boilerplate structure suggestions
- debugging TypeScript and React integration issues
- test case scaffolding (Jest + RTL)

All generated suggestions were manually reviewed, adjusted, and validated through:
- TypeScript compiler checks
- runtime testing
- manual verification of Redux state flow
- component-level testing using Jest + React Testing Library

No AI-generated code was used without verification or modification.