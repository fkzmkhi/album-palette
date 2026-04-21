---
paths:
  - "components/**"
---

- colorthief must only run in client components (`"use client"`) — it's SSR-incompatible
- Any `<img>` used for color extraction must have `crossOrigin="anonymous"`
- SearchBar debounce: 300ms before firing API call
