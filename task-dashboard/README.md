## Project Structure

- mock-server → Fake API server
- task-dashboard → Next.js frontend

# root se install
npm install

cd mock-server
npm install

cd ../task-dashboard
npm install

# project run
Start mock server
cd mock-server  
npm run mock 
Runs on:
http://localhost:4000

start frontend
cd task-dashboard
npm run dev
Runs on:
http://localhost:3000

# Run Test cases
cd task-dashboard
npm test

## Tech Stack

- Next.js
- Redux Toolkit
- MUI / Tailwind
- Jest + React Testing Library

# Task Dashboard

A production-style Task Dashboard built with **Next.js**, **React 18**, **TypeScript**, and **Redux Toolkit**. The application displays tasks from an API, supports real-time updates through WebSockets, caches data for offline usage, and streams AI-generated task summaries.

---

## Tech Stack

* Next.js 14 (App Router)
* React 18
* TypeScript (Strict Mode)
* Redux Toolkit
* React Redux
* Material UI
* Tailwind CSS
* IndexedDB (localForage)
* WebSocket API
* React Markdown
* Rehype Sanitize
* Jest
* React Testing Library

---

## Features

### Task Management

* Display paginated task list
* Search tasks by title
* Filter by status
* Filter by type
* Sort by title
* Sort by last updated
* View task details

### State Management

* Redux Toolkit
* Entity Adapter
* Memoized Selectors
* Async Thunks

### Data Layer

* API response normalization
* Strict domain models
* Runtime validation for external data
* Offline cache using IndexedDB

### Real-Time Updates

* WebSocket connection
* Automatic reconnect
* Live task updates
* Live task assignment updates
* Task creation/deletion support

### AI Summary

* Streaming summary using Server-Sent Events (SSE)
* Incremental UI updates
* Safe Markdown rendering
* XSS protection using rehype-sanitize

### Error Handling

* Loading states
* Empty states
* API error handling
* Offline fallback
* Cached data indicator

### Testing

* Unit tests for normalization
* Selector tests
* Component rendering tests

---

## Project Structure

```text
app/
components/
hooks/
lib/
redux_tasks/
store/
tests/
types/
```

---

## Installation

```bash
git clone <repository-url>

cd task-dashboard

npm install
```

---

## Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Run Tests

```bash
npm test
```

---

## Lint

```bash
npm run lint
```

---

## Type Check

```bash
npx tsc --noEmit
```

---

## Architecture

External APIs return **RawTask** objects.

```
API
        ↓
RawTask
        ↓
normalizeTask()
        ↓
Task (Domain Model)
        ↓
Redux Store
        ↓
UI Components
```

This normalization boundary ensures the UI only works with validated and normalized domain data.

---

## Offline Support

When the API is unavailable:

* Cached tasks are loaded from IndexedDB.
* The application continues to function using locally stored data.
* A cache indicator is displayed while refreshing from the server.

---

## Security

* Runtime validation before data enters the application.
* Markdown rendering is sanitized using `rehype-sanitize`.
* Safe rendering of streamed AI responses.

---

## Future Improvements

* Zod-based runtime schema validation
* Optimistic UI updates
* RTK Query integration
* Virtualized task table
* Infinite scrolling
* End-to-end tests with Playwright

---

## Author

**Monika Mohbiya**
