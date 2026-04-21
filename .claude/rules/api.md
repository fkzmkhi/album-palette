---
paths:
  - "app/api/**"
---

- Never expose `LASTFM_API_KEY` to the client — keep all Last.fm calls server-side
- Return only the data the client needs; don't forward raw Last.fm responses
