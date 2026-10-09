# System

How Dockside is set up. The rules every TTT design system follows live in the kit, not here.

| | |
|---|---|
| **Versions** | schema `ttt-ds/1` · profile `shadcn` 1.9 · kit 0.12.0 |
| **Owner** | angelli.dimatulac@ttt.studio |
| **Code** | `angellittt/kit-sandbox-dockside` · config `.ttt/design-system.json` |
| **Figma** | [Dockside — Design System](https://www.figma.com/design/gn7lif4lmbqucs5tRJjABL) · key `gn7lif4lmbqucs5tRJjABL` · not yet published as a library |
| **Tracker** | https://app.clickup.com/8593845/v/l/li/901115532915 |
| **Components** | 0 implemented · 38 validated |

**Client settings** — locale `en-CA` · week starts Sunday · date format ``.

**Dockside-specific choices**
- Radius: `radius-md` 12px (kit 8px), so buttons match cards; every other radius is the kit default.
- Motion: calm — `ease-expressive` has no overshoot.
- Fonts: Manrope (display) and Inter (sans), variable woff2, served from `fonts/`.
- Global CSS at `src/config/global.css` (profile default `src/styles/globals.css`).

**Provisional**
- `logo` — kit default (no logo; the cover shows the name as text)

**Open deviations** — [Kit Figma spec vs component code, 5 tokens](https://app.clickup.com/t/868mfh6uv).
