# Auth/Analysis: Fruit Shop Project

## Findings: **No authentication or authorization code exists in this project.**

Every file was manually examined and contents were grepped for all auth-related keywords. The project contains absolutely zero authentication or authorization infrastructure.

---

## Files Retrieved (all 8 files/entries in the project root)

1. **`server.js`** (lines 1–163) — Node.js HTTP server, zero dependencies, no auth middleware, no route guards, no user model, no session handling
2. **`index.html`** (lines 1–394) — SPA frontend, vanilla JS, no login page, no user state, no protected UI elements
3. **`package.json`** (lines 1–6) — No dependencies at all (`{}`), no `express`, `passport`, `jsonwebtoken`, `bcrypt`, `cookie-parser`, or any auth library
4. **`fruits.csv`** (lines 1–13) — Product data only (fruit names, origins, prices, image URLs)
5. **`.gitignore`** (1 line) — Only ignores `.pilotdeck/`
6. **`assets/images/`** — 12 local fruit image files (apple.jpg, banana.jpg, etc.)
7. **`.pilotdeck/plans/view-cart-button-redesign.md`** — UI styling plan, no auth references
8. **`context.md`** (the file you are reading now)

---

## Keywords Searched (case-insensitive, regex + literal, all files)

| Keyword | Matches |
|---------|---------|
| `login` | 0 |
| `password` | 0 |
| `token` | 0 |
| `session` | 0 |
| `auth` | 0 |
| `JWT` | 0 |
| `OAuth` | 0 |
| `cookie` | 0 |
| `authenticate` / `authentication` | 0 |
| `authorization` / `authorisation` | 0 |
| `user` | 0 |
| `register` | 0 |
| `signup` | 0 |
| `role` | 0 |
| `permission` | 0 |
| `guard` | 0 |
| `protected` | 0 |
| `API.?key` | 0 |

**Total matches: 0 across all 8 project files.**

---

## Evidence

### 1. server.js — No auth middleware or guards
- Uses raw `http.createServer` — no Express, no middleware pipeline
- Route dispatching in `handleApi()` (line 97–124) is a simple `if (method === 'GET' && pathname === '/api/...')` chain
- **No** `req.headers.authorization` check, no token parsing, no session lookup, no user object attached to `req`
- All three API endpoints (`/api/fruits`, `/api/categories`, `/api/cart/quote`) are fully public — no authentication required
- The only security-ish protection is a directory traversal check (`!filePath.startsWith(ROOT)`, line 134) and a 1MB body size limit (`readJsonBody`, line 68) — neither is auth
- The only 403 response is for directory traversal attempts, not authentication failures

### 2. index.html — No login UI or user state
- No login form, no register form, no password field, no session token storage
- The frontend has no concept of a "user" — no `localStorage` usage at all
- The "checkout" function (line ~345) simply shows a toast message and clears the cart — no payment, no identity required
- All API calls (`fetchJson`) are plain `fetch()` without any `Authorization` header

### 3. package.json — Zero dependencies
```json
{
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {}
}
```
No auth libraries are installed because there are no dependencies at all.

### 4. Git history — No auth-related commits
```
8b715aa feat(api): 新增 Node 后端 API 并将水果商店前端改为接口驱动
8ffc728 feat(cart): 优化购物车查看按钮样式并新增水果商品数据
28c4974 fix(filter): 修复水果分类筛选后点击「全部」无响应的问题
```
All three commits are about fruit shop features (API, cart, filtering). No auth commits exist in history.

---

## Architecture (current, as observed)

```
Browser (SPA)
  │  init() → fetchJson('/api/fruits')           [public]
  │          → fetchJson('/api/categories')       [public]
  │  addToCart() → POST /api/cart/quote           [public]
  │  checkout() → toast + clear cart              [client-side only]
  │  No auth headers, no user identity, no login
  ▼
Node.js server (server.js)
  ├─ GET  /api/fruits          → parseCsv(fruits.csv)
  ├─ GET  /api/categories      → unique cats + zh names
  ├─ POST /api/cart/quote      → compute totals from cart map
  └─ GET  /*                   → serveStatic (index.html, assets)
  No auth middleware, no route guards, no user model
```

**Every entry point is fully public/unauthenticated.**

---

## Risks & Implications

| Risk | Detail |
|------|--------|
| **No auth at all** | Adding auth later means designing it from scratch — there is no framework, no middleware layer, no user model, no session store to build on |
| **No dependency injection point** | Because the server uses raw `http.createServer`, adding an auth middleware layer (e.g., token verification) requires restructuring the request handling pipeline |
| **No user model or data store** | Even for a simple API-key or shared-secret approach, there's no database, no config file, and no environment variable scheme for credentials |
| **Frontend has no auth infrastructure** | No login page, no token storage, no protected route state — adding client-side auth means writing a login UI, token management, and protected fetch wrappers from scratch |
| **Cart/checkout is completely unprotected** | Anyone can call the API, submit any cart, and "checkout" without identity — there's no concept of "your cart" vs "someone else's cart" |

---

## Start Here

If you need to **add** authentication: open **`server.js`** — it's the single backend file and the only place where auth middleware/guards could be inserted. The `http.createServer` callback (line 149) and `handleApi()` function (line 97) are the two injection points for a request-processing pipeline.

---

## Summary

**There is no authentication or authorization code anywhere in this project.** It is a fully public, read-only fruit shop with one write-like endpoint (`/api/cart/quote`) that accepts arbitrary cart data from anyone and returns computed totals. No user identity, no session, no tokens, no passwords, no roles, no permissions, no protected routes — not even a basic shared-secret or API-key check.
