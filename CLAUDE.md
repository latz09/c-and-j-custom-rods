# C&J Custom Rods: Claude Code Instructions

Headless e-commerce rebuild for C&J Custom Rods (candjcustomrods.com), built by Jordan Latz (Latz Web Design, solo dev). Clients: Chris and Joe. Designer: Alyssa. About 95% of C&J's sales are ice rods: use that as the tiebreaker on open questions.

**Stack:** Next.js 15 App Router (plain JavaScript, no TypeScript), Tailwind 3, Framer Motion, Sanity CMS (separate repo), Shopify Storefront API (headless), Vercel.

The work runs **one phase per session**. The plan, tracker and handoffs live in `docs/build/`. That folder is the source of truth.

---

## Repos and paths

Jordan is on Windows. The VS Code terminal is **Git Bash**: use forward-slash paths (`/c/LatzWebDesign/...`) in shell commands, never `C:\...` (backslashes get eaten).

| | Path (Git Bash) | GitHub | Branch |
|---|---|---|---|
| **Frontend (this repo)** | `/c/LatzWebDesign/CODE/Client-Code/Active/2026/C-and-J-Custom-Rods/code` | `latz09/c-and-j-custom-rods` | `master` |
| **CMS** | `/c/LatzWebDesign/CODE/Client-Code/Active/2026/C-and-J-Custom-Rods/cms` (`../cms` from here) | `latz09/c-and-j-custom-rods-cms` | `main` |

- CMS Sanity project: `vx4e4v7t`, dataset `production`.
- Old v1 Sanity project (data source only, never write to it): `xov8qqkx`.
- Old data exports: `/c/LatzWebDesign/INFO/Clients/Active/2026/c-and-j/cj-export/` (`cj-old-full.tar.gz` is used in Phase 4).
- **Phases that touch the CMS (3, 4, 5):** the `../cms` repo and the `cj-export` folder are reachable through `.claude/settings.local.json` (the VS Code extension doesn't support `/add-dir`). If one isn't readable, ask Jordan to add it there.

## Build docs (`docs/build/`)

| File | What it is |
|---|---|
| `plan.md` | Phase tracker + every phase, file by file, with "done when" lines. Locked decisions at the top |
| `handoffs/` | One handoff per finished phase + `_TEMPLATE.md`. The latest is the highest phase number |
| `design-notes.md` | Text version of Alyssa's three builder screens |
| `design/` | The three screenshots (landing, ice builder, open water builder) |
| `old-cms-data-map.md` | Old v1 CMS structure, field mapping, findings, Phase 4 import approach |

Older reference docs stay in the claude.ai Project "C & J Custom Rods" (frozen): `architecture-schemas-queries-pageRoutes.md`, `shopify-headless-nextjs-build-reference.md`, the Sept 2 consolidated handoff, `iceRodOptions.html`, `openWaterRodOptions.html`, proposal, wireframe. If one is needed, ask Jordan to paste it.

---

## Start of every session

1. Read `docs/build/plan.md` (tracker + this phase's section).
2. Read the latest handoff in `docs/build/handoffs/`.
3. UI phases (6A, 6B): read `design-notes.md` and view the images in `design/`. CMS phases (3, 4): read `old-cms-data-map.md`.
4. Git check in this repo (and `../cms` if the phase touches it): on `master` / `main`, `git status` clean, `git pull`. Compare HEAD with the hashes in the latest handoff and look at anything that changed.
5. **Open with a quick rundown** before touching any file:
   - **This phase:** goal in one or two sentences
   - **Where we left off:** two or three lines from the latest handoff, plus repo changes since
   - **What we'll do, in order:** numbered files or steps, one line each
   - **What I need from you:** files, info, access, decisions (or "Nothing")
   - **Open questions that affect this phase:** only relevant ones (or "None")
   - **Done when:** from the plan
6. Wait for Jordan's go-ahead, then create the phase branch.

## While working

- **Branch per phase:** `phase-NN-short-name` from `master` (e.g. `phase-02-cart`, `phase-06a-builder-ui`). Same branch name in `../cms` when the phase touches it. Never commit to `master` or `main`.
- Edit files directly, one numbered plan step at a time. Say which step you're on. Commit when Jordan OKs a step (clear message, e.g. `Cart: add cart fragment and queries`).
- **Ask first before:** installing packages, changing anything the plan marks as locked, `git push`, and anything that touches an outside system (`sanity deploy`, dataset imports, writes to Sanity, Shopify admin). Jordan runs or approves those.
- **Never** open, print or commit `.env*` files. Jordan's `.env.local` holds the Shopify and Sanity tokens.
- **Check your work:** `npm run lint` and `npm run build` before wrap-up. Jordan tests in the browser with `npm run dev`.
- **Styling:** first pass is structure and data only unless Jordan asks for styling; he applies his own classnames. If styling, use the Tailwind config's tokens (colors `primary`, `secondary`, `accent`, `dark`, `light`; custom spacing scale like `0.75`, `1.25`, `2.5`; one radius `rounded`).
- If the plan turns out wrong, say so, agree the change with Jordan, and record it in the handoff.

## Code conventions (match the existing code)

- Plain JS. `@/` imports. Short import aliases in pages: `fetchContent as fc`, `FETCH_X_QUERY as Q`, `buildPageMetadata as BPM`. Destructure page data at the top of server components.
- Feature folders: `components/sections/<feature>/`. One GROQ query per file in `data/queries/`, export name matches the filename. Shopify helpers in `utils/shopify/`.
- Every page: `PageContainer` wrapper, `generateMetadata` via `BPM`, `export const revalidate = 10`.
- Cart and builder Shopify calls use `shopifyFetch({ ..., cache: 'no-store' })`.
- `next/link` only. Never import `Link` from `react-email` (silent styling bug, already hit once).
- `SanityImage` for Sanity images; `next/image` with `fill` for Shopify `{ url, altText }` objects. Not interchangeable.
- Dev flags as named constants (e.g. `HIDE_EMPTY_STOCK_MESSAGING`).

## Platform gotchas

- Shopify private token header is `Shopify-Storefront-Private-Token`.
- Products **and** collections must each be published to the Headless channel; "Active" isn't enough. A clean 200 with `null` usually means unpublished.
- Every custom metafield needs its own Storefront access toggle.
- Series and ice / open water are product **tags**, not collections.
- Cart API 2026-07: use `lines[].discountAllocations` and `sourceDiscountApplication`; the old cart-level fields are deprecated.
- `overflow-x: hidden` on both `html` and `body` breaks `position: sticky`. Currently only on `html`; keep it that way.

## Locked decisions (details in `plan.md`)

- Custom rods check out through the **regular Cart API** with two hidden Shopify products (`Custom Rod Build`, `Build Options`). No draft orders.
- Builder catalog (blanks, threads, grips, applications, pricing rules) lives in Sanity. Base prices live in Shopify.
- Builder fields go on the existing `rodSeries` doc. `builderStatus` is live / comingSoon / hidden.
- Phase 4 never imports the whole old export (it holds customer orders and contact submissions).

## End of every phase ("wrap up", or the phase's "done when" is met)

1. Write `docs/build/handoffs/phase-NN-short-name.md` from `_TEMPLATE.md`, including branch names and final commit hashes for both repos.
2. Update the tracker in `docs/build/plan.md` and any plan sections the phase changed.
3. Commit the docs on the phase branch.
4. Tell Jordan exactly what's left for him: push the branch(es), check the Vercel preview, merge into `master` / `main`, plus any `sanity deploy` or admin steps.
5. Give the kickoff message for the next session: `Starting Phase [N]. Follow CLAUDE.md.`

## Writing for Jordan

Direct, no filler. No em dashes in docs or messages (use commas, periods or colons). Client- or designer-facing emails go in chat as plain text for him to copy.
