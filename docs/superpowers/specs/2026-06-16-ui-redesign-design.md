# FaxBox UI Redesign + Animation — Design Spec

**Date:** 2026-06-16
**Status:** Approved
**Approach:** B — Token reskin + targeted structural polish + shared motion primitives
**Implementation:** TDD (tests first)

## Goal

FaxBox's current UI is pure grayscale (0% saturation across all tokens) with no motion. View swaps are instant and jarring, status is plain text, stat cards are bare numbers. This redesign introduces a warm, professional medical-teal palette and a consistent motion system so the app feels alive while staying trustworthy.

## Decisions (from brainstorming)

| Decision | Choice |
|---|---|
| Animation library | `motion` (framer-motion). **Not** Remotion — Remotion generates video files, not UI animation. |
| Design direction | A — Refined Clinical (warm neutrals + medical teal accent) |
| Scope | All 7 screens + app shell |
| Approach | B — token reskin + structural polish + shared primitives |
| Method | TDD — write tests before implementation |

## 1. Color System

Replaces the grayscale CSS custom properties in `src/index.css` with a teal-accented palette. **Same shadcn token names** (`--primary`, `--accent`, `--muted`, etc.) get new values, so every existing shadcn component inherits the new look automatically. New `--status-*` tokens are added for semantic status badges.

### Light mode

| Token | Old (grayscale) | New |
|---|---|---|
| `--primary` | `0 0% 9%` (black) | Teal 600 — `172 76% 32%` (`#0d9488`) |
| `--primary-foreground` | `0 0% 98%` | `0 0% 100%` |
| `--accent` | `0 0% 96.1%` | Teal 50 — `168 83% 96%` (`#f0fdfa`) |
| `--accent-foreground` | `0 0% 9%` | Teal 700 — `173 80% 27%` (`#0f766e`) |
| `--muted` | `0 0% 96.1%` | Slate 100 — `210 40% 96%` (`#f1f5f9`) |
| `--muted-foreground` | `0 0% 45.1%` | Slate 500 — `215 16% 47%` (`#64748b`) |
| `--background` | `0 0% 100%` | Slate 50 — `210 40% 98%` (`#f8fafc`) |
| `--foreground` | `0 0% 3.9%` | Slate 900 — `222 47% 11%` (`#0f172a`) |
| `--ring` | `0 0% 3.9%` | Teal 600 — `172 76% 32%` |
| `--border` | `0 0% 89.8%` | Slate 200 — `214 32% 88%` (`#e2e8f0`) |

### Dark mode

Teal accent preserved on a Slate 950 base (`222 47% 6%`). `--primary` becomes Teal 500 (`172 76% 42%`, `#14b8a6`) for contrast against dark surfaces.

### New status tokens (both themes)

| Token | Color | Hex |
|---|---|---|
| `--status-new` | Emerald 500 | `#10b981` |
| `--status-viewed` | Slate 400 | `#94a3b8` |
| `--status-sent` | Emerald 500 | `#10b981` |
| `--status-sending` | Amber 500 | `#f59e0b` |
| `--status-failed` | Red 500 | `#ef4444` |

Each has a paired tint background (e.g. `--status-new-bg`: Emerald 50 `#ecfdf5`, Red 50 `#fef2f2` for failed, Amber 50 `#fffbeb` for sending, Slate 100 `#f1f5f9` for viewed).

## 2. Shared Primitives (5)

All primitives live in `src/components/motion/` and `src/lib/motion-variants.ts`. Composable — screens compose these rather than reinventing animation.

### 2.1 `motion-variants.ts`
Shared easing/duration constants + reusable variant objects:

```typescript
export const EASE_OUT = [0.16, 1, 0.3, 1] as const      // smooth ease-out
export const EASE_SPRING = { type: "spring", stiffness: 380, damping: 30 } as const

export const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
} as const

export const scaleIn = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
} as const

export const VIEW_DURATION = 0.22      // seconds (220ms)
export const ITEM_DURATION = 0.18      // per-item (180ms)
export const STAGGER_DELAY = 0.04      // 40ms between items
```

### 2.2 `ViewTransition`
Wraps every view swap. `AnimatePresence` + `mode="wait"` so the outgoing view finishes before the incoming one starts.

- Fade + 8px slide up
- 220ms, `EASE_OUT`
- Keyed by `activeView` so motion detects the change
- Respects `prefers-reduced-motion` (instant swap)

### 2.3 `StatusBadge`
Props: `status: "New" | "Viewed" | "Sent" | "Sending" | "Failed"`. Renders colored chip + status dot. "Sending" dot pulses (CSS `@keyframes`). Maps status → `--status-*` tokens. Entrance: `scaleIn` variant.

### 2.4 `StatCard`
Props: `value: number`, `label: string`, `icon: ReactNode`, `variant?: "teal" | "red"`. Icon in a tinted rounded square + big number + label. Number counts up from 0 → value on mount (600ms). Respects reduced motion (shows final value instantly).

### 2.5 `StaggerGroup` + `StaggerItem`
- `StaggerGroup`: container that applies `staggerChildren: STAGGER_DELAY`
- `StaggerItem`: each child uses `fadeUp`, 180ms
- Used by table rows, contact lists, attachment lists

## 3. Animation Spec

| Element | Motion | Duration | Easing |
|---|---|---|---|
| ViewTransition (all view swaps) | fade + 8px slide up | 220ms | ease-out |
| List stagger (table rows, contacts) | fade + 6px slide, 40ms between | 180ms each | ease-out |
| StatCard count-up | number 0 → value | 600ms | ease-out |
| Badge entrance | scale 0.85 → 1 + fade | 160ms | ease-out |
| Card hover | lift -2px + soft shadow | 180ms | ease-out |
| Sidebar active | highlight pill slides (shared `layoutId`) | 240ms | `[0.32, 0.72, 0, 1]` |
| Pagination | crossfade new page content | 160ms | ease-out |
| Sending status dot | opacity pulse loop | 1.4s loop | linear |

**Accessibility:** `@media (prefers-reduced-motion: reduce)` disables all motion. Views swap instantly, counters show final value, no stagger. Every primitive checks this.

## 4. Per-Screen Changes

### App shell (`App.tsx`)
- `ViewTransition` wraps the active-view switch
- Sidebar: animated active pill via shared `layoutId="sidebar-active"` on `SidebarMenuButton`
- Brand mark: teal gradient square
- Inbox count badge (red) on sidebar item

### Inbox
- `StatCard` (teal) with count-up for "new faxes today"
- `StatusBadge` replaces plain status text in table
- `StaggerGroup`/`StaggerItem` on table rows
- Pagination crossfade on page change
- Empty state when no faxes (illustration + message)

### Outbox
- Dual `StatCard`s: total sent (teal) + failed (red)
- `StatusBadge` for Sent/Failed/Sending
- Preview + Edit actions, staggered

### Send New Fax
- Recipient search dropdown animates open (height + fade)
- Attachment list uses `StaggerGroup`
- Submit button: idle → loading (spinner) → success states
- Form fields: animated teal focus ring

### Contacts
- Initials avatar in teal tint
- Staggered table + row hover lift
- Edit/delete actions

### Add New Contact
- Section reveal on mount (`fadeUp`)
- Validation feedback animates in
- Save → success → return animation

### Settings
- Loading skeleton while detecting devices (replaces plain "Detecting devices..." text)
- Save → success message slides in
- Sectioned layout with subtle reveal

### Fax Preview
- PDF viewer fades in on load
- Scan button → spinner → result
- Metadata bar with sender info
- Back transition reverses (exit variant)

## 5. Dependencies

- **Add:** `motion` (framer-motion v11+). Local install only — never global.
- **Keep:** React 19, Tailwind 4, shadcn/ui, Radix, Lucide, react-pdf. No replacement of existing components.
- **Update:** `AGENTS.md` is outdated (says "no Tailwind" but project uses Tailwind 4). Will update to reflect actual stack.

## 6. File Organization

New files:
```
src/
├── components/
│   └── motion/
│       ├── ViewTransition.tsx
│       ├── StatusBadge.tsx
│       ├── StatCard.tsx
│       ├── StaggerGroup.tsx
│       └── StaggerItem.tsx
└── lib/
    └── motion-variants.ts
```

Modified files:
- `src/index.css` — token values (light + dark) + status tokens + reduced-motion + pulse keyframe
- `src/App.tsx` — ViewTransition wrapper, sidebar active pill, count badge
- `src/components/app-sidebar.tsx` — brand mark, layoutId, count badge
- `src/pages/*` — adopt primitives per section 4

## 7. Testing Strategy (TDD)

Per user request, implementation follows TDD. Framework: **Vitest** + **React Testing Library** (not yet installed — will add). Tests written before implementation for each primitive and behavior:

- `StatusBadge`: renders all 5 variants, status→token mapping correct, "Sending" has pulse class
- `StatCard`: renders value/label/icon, count-up reaches target (mock timer), reduced-motion shows final value instantly
- `StaggerGroup`/`StaggerItem`: applies correct transition props, respects stagger delay
- `ViewTransition`: renders children, swaps on key change, respects reduced-motion
- `motion-variants.ts`: constants exported with expected values
- Status→color mapping utility: pure function, all 5 cases
- Reduced-motion hook: returns false by default, true when media query matches

Single test command: `npm run test` (Vitest).

## 8. Out of Scope

- No router added (keep `useState` view switching — `ViewTransition` handles the animation)
- No backend/data changes (mock data stays)
- No Remotion (clarified — wrong tool for UI animation)
- No new shadcn components beyond the 5 motion primitives
- No refactoring unrelated to the UI/animation goal
