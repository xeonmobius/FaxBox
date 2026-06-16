# FaxBox UI Redesign + Animation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace FaxBox's dead grayscale UI with a refined-clinical teal palette and a consistent motion system (view transitions, status badges, animated stat cards, staggered lists) across all 7 screens.

**Architecture:** New CSS custom-property values (same shadcn token names) give every existing component the new look automatically. Five shared primitives (`ViewTransition`, `StatusBadge`, `StatCard`, `StaggerGroup`/`StaggerItem`) built on `motion` provide consistent, composable animation. Screens adopt the primitives; no router, no data changes.

**Tech Stack:** React 19, TypeScript (strict), Tailwind v4, shadcn/ui (new-york), `motion` (animation), Vitest + React Testing Library (tests, TDD).

**Spec:** `docs/superpowers/specs/2026-06-16-ui-redesign-design.md`

---

## File Structure

**New files:**
| File | Responsibility |
|---|---|
| `vitest.config.ts` | Vitest config (jsdom env, setup file, alias) |
| `src/test/setup.ts` | RTL + jest-dom matchers, fake-timer defaults |
| `src/lib/motion-variants.ts` | Shared easing/duration constants + reusable variant objects |
| `src/lib/status-utils.ts` | `FaxStatus` type + `getStatusConfig()` status→token/label map |
| `src/lib/use-count-up.ts` | `useCountUp(target)` hook: animates 0→target, respects reduced motion |
| `src/components/motion/StatusBadge.tsx` | Colored status chip + dot |
| `src/components/motion/StatCard.tsx` | Icon + count-up number + label |
| `src/components/motion/StaggerGroup.tsx` | Container applying staggerChildren |
| `src/components/motion/StaggerItem.tsx` | Child using fadeUp variant |
| `src/components/motion/ViewTransition.tsx` | AnimatePresence view-swap wrapper |
| `src/components/EmptyState.tsx` | Icon + title + subtitle empty-state |

**Modified files:**
| File | Change |
|---|---|
| `src/index.css` | New token values (light+dark), status tokens, pulse keyframe, reduced-motion |
| `src/App.tsx` | Wrap views in `ViewTransition`, sidebar active pill, count badge |
| `src/components/app-sidebar.tsx` | Brand mark, `layoutId` active pill, inbox count badge |
| `src/pages/FaxPreview.tsx` | PDF fade-in, scan spinner, back transition |
| `src/pages/Settings.tsx` | Skeleton loading, save success slide |
| `src/pages/SendNewFax.tsx` | Recipient dropdown anim, attachment stagger, submit states |
| `src/pages/Contacts.tsx` | Initials avatar, stagger, hover lift |
| `src/pages/AddNewContact.tsx` | Section reveal, validation feedback, save |
| `package.json` | New deps + `test` script |
| `AGENTS.md` | Correct outdated stack notes (Tailwind v4, shadcn, motion, Vitest) |

---

## Phase 0 — Tooling

### Task 1: Install dependencies + configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Modify: `package.json`

- [ ] **Step 1: Install runtime + test deps (local only, never global)**

Run:
```bash
npm install motion
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react
```
`@vitejs/plugin-react` is already a dep but is referenced by vitest config; keeping it explicit avoids surprises. Expected: `added N packages`. If prompted about peer deps, accept defaults.

- [ ] **Step 2: Create `vitest.config.ts`**

```typescript
import path from "path"
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
})
```

- [ ] **Step 3: Create `src/test/setup.ts`**

```typescript
import "@testing-library/jest-dom/vitest"
import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"

afterEach(() => {
  cleanup()
})
```

- [ ] **Step 4: Add test scripts to `package.json`**

In the `"scripts"` block, add after `"preview"`:
```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 5: Smoke test that the runner works**

Create `src/test/smoke.test.ts`:
```typescript
import { describe, it, expect } from "vitest"

describe("smoke", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2)
  })
})
```

Run: `npm run test`
Expected: `1 passed`.

- [ ] **Step 6: Delete smoke test + commit**

```bash
rm src/test/smoke.test.ts
git add vitest.config.ts src/test/setup.ts package.json bun.lock package-lock.json
git commit -m "Add Vitest + React Testing Library test setup"
```

---

## Phase 1 — Foundation (logic + tokens)

### Task 2: motion-variants.ts

**Files:**
- Create: `src/lib/motion-variants.ts`
- Test: `src/lib/motion-variants.test.ts`

- [ ] **Step 1: Write the failing test**

`src/lib/motion-variants.test.ts`:
```typescript
import { describe, it, expect } from "vitest"
import {
  EASE_OUT,
  VIEW_DURATION,
  ITEM_DURATION,
  STAGGER_DELAY,
  fadeUp,
  scaleIn,
  staggerGroup,
} from "./motion-variants"

describe("motion-variants", () => {
  it("exports easing as a 4-number cubic-bezier array", () => {
    expect(EASE_OUT).toEqual([0.16, 1, 0.3, 1])
  })

  it("exports timing constants in seconds", () => {
    expect(VIEW_DURATION).toBe(0.22)
    expect(ITEM_DURATION).toBe(0.18)
    expect(STAGGER_DELAY).toBe(0.04)
  })

  it("fadeUp animates opacity and y on initial/animate/exit", () => {
    expect(fadeUp.initial).toEqual({ opacity: 0, y: 8 })
    expect(fadeUp.animate).toEqual({ opacity: 1, y: 0 })
    expect(fadeUp.exit).toEqual({ opacity: 0, y: -8 })
  })

  it("scaleIn animates opacity and scale", () => {
    expect(scaleIn.initial).toEqual({ opacity: 0, scale: 0.85 })
    expect(scaleIn.animate).toEqual({ opacity: 1, scale: 1 })
  })

  it("staggerGroup sets staggerChildren to STAGGER_DELAY", () => {
    expect(staggerGroup.animate.staggerChildren).toBe(STAGGER_DELAY)
    expect(staggerGroup.initial).toBe("initial")
    expect(staggerGroup.animate).toHaveProperty("transition")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/motion-variants.test.ts`
Expected: FAIL — module not found / `EASE_OUT is not defined`.

- [ ] **Step 3: Write the implementation**

`src/lib/motion-variants.ts`:
```typescript
import type { Variants } from "motion/react"

export const EASE_OUT = [0.16, 1, 0.3, 1] as const

export const VIEW_DURATION = 0.22
export const ITEM_DURATION = 0.18
export const STAGGER_DELAY = 0.04

export const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
} as const

export const scaleIn = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
} as const

export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: ITEM_DURATION, ease: EASE_OUT } },
}

export const staggerGroup: Variants = {
  initial: "initial",
  animate: {
    transition: { staggerChildren: STAGGER_DELAY },
  },
  variants: {
    initial: {},
    animate: {},
  },
}
```

Note: `staggerGroup` is a container config; the staggered children reference variant names. `staggerGroup.animate.staggerChildren === STAGGER_DELAY` is asserted by reading the transition object. To make the test assertion exact, use:

```typescript
export const staggerGroup: Variants = {
  initial: "hidden",
  animate: "visible",
  transition: undefined,
  variants: {
    hidden: { transition: { staggerChildren: 0 } },
    visible: { transition: { staggerChildren: STAGGER_DELAY } },
  },
}
```
But the cleanest shape matching the test is the explicit object below (use this final version):

`src/lib/motion-variants.ts` (FINAL):
```typescript
import type { Variants } from "motion/react"

export const EASE_OUT = [0.16, 1, 0.3, 1] as const
export const VIEW_DURATION = 0.22
export const ITEM_DURATION = 0.18
export const STAGGER_DELAY = 0.04

export const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
} as const

export const scaleIn = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
} as const

export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: ITEM_DURATION, ease: EASE_OUT } },
}

export const staggerGroup: Variants = {
  initial: "hidden",
  animate: "visible",
  variants: {
    hidden: {},
    visible: { transition: { staggerChildren: STAGGER_DELAY } },
  },
}
```
The test reads `staggerGroup.animate.staggerChildren`. With motion's `Variants`, the literal key `animate` is a string ("visible") here, so `staggerGroup.animate.staggerChildren` is undefined. Adjust the test to the canonical motion API instead. Replace the last assertion in Step 1 with:

```typescript
  it("staggerGroup staggers visible children by STAGGER_DELAY", () => {
    const visibleVariant = staggerGroup.variants!.visible as { transition: { staggerChildren: number } }
    expect(visibleVariant.transition.staggerChildren).toBe(STAGGER_DELAY)
    expect(staggerGroup.initial).toBe("hidden")
    expect(staggerGroup.animate).toBe("visible")
  })
```
(Make this correction in the test file when writing it.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/motion-variants.test.ts`
Expected: `5 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/motion-variants.ts src/lib/motion-variants.test.ts
git commit -m "Add shared motion variants and timing constants"
```

---

### Task 3: status-utils.ts

**Files:**
- Create: `src/lib/status-utils.ts`
- Test: `src/lib/status-utils.test.ts`

- [ ] **Step 1: Write the failing test**

`src/lib/status-utils.test.ts`:
```typescript
import { describe, it, expect } from "vitest"
import { getStatusConfig, STATUS_CONFIG } from "./status-utils"

describe("status-utils", () => {
  it("maps New to emerald tokens", () => {
    const c = getStatusConfig("New")
    expect(c.label).toBe("New")
    expect(c.dotClass).toBe("bg-emerald-500")
    expect(c.badgeClass).toContain("bg-emerald-50")
  })

  it("maps Viewed to slate tokens", () => {
    const c = getStatusConfig("Viewed")
    expect(c.dotClass).toBe("bg-slate-400")
    expect(c.badgeClass).toContain("bg-slate-100")
  })

  it("maps Sent to emerald tokens", () => {
    const c = getStatusConfig("Sent")
    expect(c.dotClass).toBe("bg-emerald-500")
  })

  it("maps Sending to amber tokens and marks pulsing", () => {
    const c = getStatusConfig("Sending")
    expect(c.dotClass).toBe("bg-amber-500")
    expect(c.badgeClass).toContain("bg-amber-50")
    expect(c.pulse).toBe(true)
  })

  it("maps Failed to red tokens", () => {
    const c = getStatusConfig("Failed")
    expect(c.dotClass).toBe("bg-red-500")
    expect(c.badgeClass).toContain("bg-red-50")
  })

  it("STATUS_CONFIG has exactly 5 entries", () => {
    expect(Object.keys(STATUS_CONFIG)).toHaveLength(5)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/status-utils.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

`src/lib/status-utils.ts`:
```typescript
export type FaxStatus = "New" | "Viewed" | "Sent" | "Sending" | "Failed"

export interface StatusConfig {
  label: string
  dotClass: string
  badgeClass: string
  pulse: boolean
}

export const STATUS_CONFIG: Record<FaxStatus, StatusConfig> = {
  New: {
    label: "New",
    dotClass: "bg-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700",
    pulse: false,
  },
  Viewed: {
    label: "Viewed",
    dotClass: "bg-slate-400",
    badgeClass: "bg-slate-100 text-slate-600",
    pulse: false,
  },
  Sent: {
    label: "Sent",
    dotClass: "bg-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700",
    pulse: false,
  },
  Sending: {
    label: "Sending",
    dotClass: "bg-amber-500",
    badgeClass: "bg-amber-50 text-amber-700",
    pulse: true,
  },
  Failed: {
    label: "Failed",
    dotClass: "bg-red-500",
    badgeClass: "bg-red-50 text-red-700",
    pulse: false,
  },
}

export function getStatusConfig(status: FaxStatus): StatusConfig {
  return STATUS_CONFIG[status]
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/status-utils.test.ts`
Expected: `7 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/status-utils.ts src/lib/status-utils.test.ts
git commit -m "Add fax status to token mapping"
```

---

### Task 4: use-count-up.ts

**Files:**
- Create: `src/lib/use-count-up.ts`
- Test: `src/lib/use-count-up.test.ts`

- [ ] **Step 1: Write the failing test**

`src/lib/use-count-up.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useCountUp } from "./use-count-up"

describe("useCountUp", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns the target instantly when reduced motion is requested", () => {
    vi.stubGlobal("matchMedia", createMatchMedia(true))
    const { result } = renderHook(() => useCountUp(42, { duration: 600 }))
    expect(result.current).toBe(42)
    vi.unstubAllGlobals()
  })

  it("starts at 0 and reaches the target after the duration", () => {
    vi.stubGlobal("matchMedia", createMatchMedia(false))
    const { result } = renderHook(() => useCountUp(42, { duration: 600 }))
    expect(result.current).toBe(0)
    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(result.current).toBe(42)
    vi.unstubAllGlobals()
  })
})

function createMatchMedia(reduce: boolean) {
  return (query: string) => ({
    matches: query.includes("reduce") ? reduce : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/use-count-up.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

`src/lib/use-count-up.ts`:
```typescript
import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

interface CountUpOptions {
  duration?: number
}

export function useCountUp(target: number, options: CountUpOptions = {}): number {
  const { duration = 600 } = options
  const reduceMotion = useReducedMotion()
  const [value, setValue] = useState(0)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    if (reduceMotion) {
      setValue(target)
      return
    }

    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick)
      }
    }
    frame.current = requestAnimationFrame(tick)

    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    }
  }, [target, duration, reduceMotion])

  return value
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/use-count-up.test.ts`
Expected: `2 passed`. Note: the requestAnimationFrame-driven version uses `performance.now()`; in jsdom fake-timer mode, `vi.advanceTimersByTime` also advances `performance.now` when `vi.useFakeTimers({ toFake: ["performance", "requestAnimationFrame", "Date"] })` is configured. If the test does not reach 42, switch the hook to a `setInterval`/`setTimeout`-based implementation which is timer-driven and fake-timer-friendly. FINAL hook (timer-based, use this if rAF test fails):

```typescript
import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

export function useCountUp(target: number, options: { duration?: number } = {}): number {
  const { duration = 600 } = options
  const reduceMotion = useReducedMotion()
  const [value, setValue] = useState(0)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    if (reduceMotion) {
      setValue(target)
      return
    }
    const steps = Math.max(1, Math.round(duration / 16))
    const stepDuration = duration / steps
    let current = 0
    setValue(0)
    const interval = window.setInterval(() => {
      current += 1
      const progress = current / steps
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (current >= steps) window.clearInterval(interval)
    }, stepDuration)
    raf.current = interval as unknown as number
    return () => window.clearInterval(interval)
  }, [target, duration, reduceMotion])

  return value
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- src/lib/use-count-up.test.ts`
Expected: `2 passed`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/use-count-up.ts src/lib/use-count-up.test.ts
git commit -m "Add useCountUp hook with reduced-motion support"
```

---

### Task 5: Color tokens in index.css

**Files:**
- Modify: `src/index.css`

This is a CSS token swap — verified via build, not unit test (no logic).

- [ ] **Step 1: Replace the light-mode `:root` token block**

In `src/index.css`, replace the entire contents of the first `@layer base { :root { ... } }` `:root` block (lines 7–40) with:

```css
  :root {
    --background: 210 40% 98%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    --primary: 172 76% 32%;
    --primary-foreground: 0 0% 100%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222 47% 11%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --accent: 168 83% 96%;
    --accent-foreground: 173 80% 27%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;
    --border: 214 32% 88%;
    --input: 214 32% 88%;
    --ring: 172 76% 32%;
    --chart-1: 172 76% 42%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 40%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
    --sidebar-background: 210 40% 96%;
    --sidebar-foreground: 215 19% 27%;
    --sidebar-primary: 172 76% 32%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 168 83% 94%;
    --sidebar-accent-foreground: 173 80% 27%;
    --sidebar-border: 214 32% 88%;
    --sidebar-ring: 172 76% 32%;
    --status-new: 152 76% 40%;
    --status-viewed: 215 16% 55%;
    --status-sent: 152 76% 40%;
    --status-sending: 36 96% 50%;
    --status-failed: 0 84% 60%;
  }
```

- [ ] **Step 2: Replace the dark-mode `.dark` token block**

Replace the `.dark { ... }` block (lines 42–75) with:

```css
  .dark {
    --background: 222 47% 6%;
    --foreground: 210 40% 98%;
    --card: 222 47% 9%;
    --card-foreground: 210 40% 98%;
    --popover: 222 47% 9%;
    --popover-foreground: 210 40% 98%;
    --primary: 172 76% 42%;
    --primary-foreground: 222 47% 6%;
    --secondary: 222 30% 16%;
    --secondary-foreground: 210 40% 98%;
    --muted: 222 30% 16%;
    --muted-foreground: 215 20% 65%;
    --accent: 173 50% 18%;
    --accent-foreground: 168 83% 90%;
    --destructive: 0 62% 40%;
    --destructive-foreground: 0 0% 98%;
    --border: 222 30% 20%;
    --input: 222 30% 20%;
    --ring: 172 76% 42%;
    --chart-1: 172 76% 52%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --sidebar-background: 222 47% 8%;
    --sidebar-foreground: 210 40% 90%;
    --sidebar-primary: 172 76% 42%;
    --sidebar-primary-foreground: 222 47% 6%;
    --sidebar-accent: 222 30% 16%;
    --sidebar-accent-foreground: 210 40% 90%;
    --sidebar-border: 222 30% 18%;
    --sidebar-ring: 172 76% 42%;
    --status-new: 152 76% 50%;
    --status-viewed: 215 16% 65%;
    --status-sent: 152 76% 50%;
    --status-sending: 36 96% 55%;
    --status-failed: 0 72% 60%;
  }
```

- [ ] **Step 3: Replace the standalone `:root` sidebar block**

Replace the second standalone `:root { --sidebar: ... }` block (lines 88–97) with:

```css
:root {
  --sidebar: hsl(210 40% 96%);
  --sidebar-foreground: hsl(215 19% 27%);
  --sidebar-primary: hsl(172 76% 32%);
  --sidebar-primary-foreground: hsl(0 0% 100%);
  --sidebar-accent: hsl(168 83% 94%);
  --sidebar-accent-foreground: hsl(173 80% 27%);
  --sidebar-border: hsl(214 32% 88%);
  --sidebar-ring: hsl(172 76% 32%);
}
```

- [ ] **Step 4: Replace the standalone `.dark` sidebar block**

Replace the second standalone `.dark { --sidebar: ... }` block (lines 99–108) with:

```css
.dark {
  --sidebar: hsl(222 47% 8%);
  --sidebar-foreground: hsl(210 40% 90%);
  --sidebar-primary: hsl(172 76% 42%);
  --sidebar-primary-foreground: hsl(222 47% 6%);
  --sidebar-accent: hsl(222 30% 16%);
  --sidebar-accent-foreground: hsl(210 40% 90%);
  --sidebar-border: hsl(222 30% 18%);
  --sidebar-ring: hsl(172 76% 42%);
}
```

- [ ] **Step 5: Add pulse keyframe + reduced-motion guard at end of file**

Append at the very end of `src/index.css`:

```css
@keyframes status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

.animate-status-pulse {
  animation: status-pulse 1.4s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 6: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds (tsc + vite), no errors.

- [ ] **Step 7: Commit**

```bash
git add src/index.css
git commit -m "Apply refined-clinical teal palette and status tokens"
```

---

## Phase 2 — Motion primitives

### Task 6: StatusBadge

**Files:**
- Create: `src/components/motion/StatusBadge.tsx`
- Test: `src/components/motion/StatusBadge.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/motion/StatusBadge.test.tsx`:
```typescript
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { StatusBadge } from "./StatusBadge"

describe("StatusBadge", () => {
  it("renders the status label", () => {
    render(<StatusBadge status="New" />)
    expect(screen.getByText("New")).toBeInTheDocument()
  })

  it("renders a status dot element", () => {
    const { container } = render(<StatusBadge status="Sent" />)
    expect(container.querySelector("[data-testid='status-dot']")).not.toBeNull()
  })

  it("applies the pulse class only for Sending", () => {
    const { container: sending } = render(<StatusBadge status="Sending" />)
    expect(sending.querySelector("[data-testid='status-dot']")?.className).toContain("animate-status-pulse")

    const { container: sent } = render(<StatusBadge status="Sent" />)
    expect(sent.querySelector("[data-testid='status-dot']")?.className).not.toContain("animate-status-pulse")
  })

  it("applies the emerald token classes for New", () => {
    const { container } = render(<StatusBadge status="New" />)
    const badge = container.querySelector("[data-testid='status-badge']")!
    expect(badge.className).toContain("bg-emerald-50")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/motion/StatusBadge.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

`src/components/motion/StatusBadge.tsx`:
```typescript
import { motion } from "motion/react"
import { getStatusConfig, type FaxStatus } from "@/lib/status-utils"
import { scaleIn } from "@/lib/motion-variants"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: FaxStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = getStatusConfig(status)
  return (
    <motion.span
      data-testid="status-badge"
      data-status={status}
      variants={scaleIn}
      initial="initial"
      animate="animate"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        config.badgeClass,
        className
      )}
    >
      <span
        data-testid="status-dot"
        className={cn("h-1.5 w-1.5 rounded-full", config.dotClass, config.pulse && "animate-status-pulse")}
      />
      {config.label}
    </motion.span>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/motion/StatusBadge.test.tsx`
Expected: `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/motion/StatusBadge.tsx src/components/motion/StatusBadge.test.tsx
git commit -m "Add StatusBadge component"
```

---

### Task 7: StatCard

**Files:**
- Create: `src/components/motion/StatCard.tsx`
- Test: `src/components/motion/StatCard.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/motion/StatCard.test.tsx`:
```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { StatCard } from "./StatCard"

describe("StatCard", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval", "Date", "performance"] })
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders the label", () => {
    vi.stubGlobal("matchMedia", createMatchMedia(true))
    render(<StatCard value={5} label="new faxes today" icon={<span>i</span>} />)
    expect(screen.getByText("new faxes today")).toBeInTheDocument()
    vi.unstubAllGlobals()
  })

  it("shows the final value instantly under reduced motion", () => {
    vi.stubGlobal("matchMedia", createMatchMedia(true))
    render(<StatCard value={42} label="count" icon={<span>i</span>} />)
    expect(screen.getByTestId("stat-value")).toHaveTextContent("42")
    vi.unstubAllGlobals()
  })

  it("applies the teal variant icon classes", () => {
    vi.stubGlobal("matchMedia", createMatchMedia(true))
    const { container } = render(<StatCard value={1} label="x" icon={<span>i</span>} variant="teal" />)
    expect(container.querySelector("[data-testid='stat-icon']")?.className).toContain("bg-teal-100")
    vi.unstubAllGlobals()
  })

  it("applies the red variant icon classes", () => {
    vi.stubGlobal("matchMedia", createMatchMedia(true))
    const { container } = render(<StatCard value={1} label="x" icon={<span>i</span>} variant="red" />)
    expect(container.querySelector("[data-testid='stat-icon']")?.className).toContain("bg-red-50")
    vi.unstubAllGlobals()
  })
})

function createMatchMedia(reduce: boolean) {
  return (query: string) => ({
    matches: query.includes("reduce") ? reduce : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/motion/StatCard.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

`src/components/motion/StatCard.tsx`:
```typescript
import type { ReactNode } from "react"
import { motion } from "motion/react"
import { useCountUp } from "@/lib/use-count-up"
import { fadeUp } from "@/lib/motion-variants"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  value: number
  label: string
  icon: ReactNode
  variant?: "teal" | "red"
}

const iconVariant: Record<NonNullable<StatCardProps["variant"]>, string> = {
  teal: "bg-teal-100 text-teal-700",
  red: "bg-red-50 text-red-600",
}

export function StatCard({ value, label, icon, variant = "teal" }: StatCardProps) {
  const display = useCountUp(value, { duration: 600 })
  return (
    <motion.div variants={fadeUp} initial="initial" animate="animate">
      <Card className="w-fit">
        <CardContent className="flex items-center gap-3 pt-6">
          <span
            data-testid="stat-icon"
            className={cn("flex h-9 w-9 items-center justify-center rounded-lg", iconVariant[variant])}
          >
            {icon}
          </span>
          <div>
            <div data-testid="stat-value" className="text-3xl font-bold leading-none">
              {display}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/motion/StatCard.test.tsx`
Expected: `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/motion/StatCard.tsx src/components/motion/StatCard.test.tsx
git commit -m "Add StatCard with count-up animation"
```

---

### Task 8: StaggerGroup + StaggerItem

**Files:**
- Create: `src/components/motion/StaggerGroup.tsx`
- Create: `src/components/motion/StaggerItem.tsx`
- Test: `src/components/motion/Stagger.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/motion/Stagger.test.tsx`:
```typescript
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { StaggerGroup } from "./StaggerGroup"
import { StaggerItem } from "./StaggerItem"

describe("Stagger", () => {
  it("renders children inside group and items", () => {
    render(
      <StaggerGroup>
        <StaggerItem>a</StaggerItem>
        <StaggerItem>b</StaggerItem>
      </StaggerGroup>
    )
    expect(screen.getByText("a")).toBeInTheDocument()
    expect(screen.getByText("b")).toBeInTheDocument()
  })

  it("group is a motion element with variants", () => {
    const { container } = render(
      <StaggerGroup>
        <StaggerItem>x</StaggerItem>
      </StaggerGroup>
    )
    expect(container.firstChild).not.toBeNull()
  })

  it("accepts an as prop to render a custom tag", () => {
    render(
      <StaggerGroup as="ul">
        <StaggerItem as="li">one</StaggerItem>
      </StaggerGroup>
    )
    expect(screen.getByText("one").tagName).toBe("LI")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/motion/Stagger.test.tsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Write StaggerGroup**

`src/components/motion/StaggerGroup.tsx`:
```typescript
import type { ElementType, ReactNode } from "react"
import { motion } from "motion/react"
import { staggerGroup } from "@/lib/motion-variants"
import { cn } from "@/lib/utils"

interface StaggerGroupProps {
  children: ReactNode
  as?: ElementType
  className?: string
}

export function StaggerGroup({ children, as, className }: StaggerGroupProps) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div
  const Tag: ElementType = as ? (MotionTag as ElementType) : motion.div
  return (
    <Tag
      initial="hidden"
      animate="visible"
      variants={staggerGroup.variants ?? staggerGroup}
      className={cn(className)}
    >
      {children}
    </Tag>
  )
}
```

- [ ] **Step 4: Write StaggerItem**

`src/components/motion/StaggerItem.tsx`:
```typescript
import type { ElementType, ReactNode } from "react"
import { motion } from "motion/react"
import { fadeUpVariant } from "@/lib/motion-variants"
import { cn } from "@/lib/utils"

interface StaggerItemProps {
  children: ReactNode
  as?: ElementType
  className?: string
}

export function StaggerItem({ children, as, className }: StaggerItemProps) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div
  const Tag: ElementType = as ? (MotionTag as ElementType) : motion.div
  return (
    <Tag variants={fadeUpVariant} className={cn(className)}>
      {children}
    </Tag>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- src/components/motion/Stagger.test.tsx`
Expected: `3 passed`.

- [ ] **Step 6: Commit**

```bash
git add src/components/motion/StaggerGroup.tsx src/components/motion/StaggerItem.tsx src/components/motion/Stagger.test.tsx
git commit -m "Add StaggerGroup and StaggerItem components"
```

---

### Task 9: ViewTransition

**Files:**
- Create: `src/components/motion/ViewTransition.tsx`
- Test: `src/components/motion/ViewTransition.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/motion/ViewTransition.test.tsx`:
```typescript
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ViewTransition } from "./ViewTransition"

describe("ViewTransition", () => {
  it("renders the active child content", () => {
    render(
      <ViewTransition viewKey="inbox">
        <div>Inbox Content</div>
      </ViewTransition>
    )
    expect(screen.getByText("Inbox Content")).toBeInTheDocument()
  })

  it("re-mounts when viewKey changes (animate swap)", () => {
    const { rerender } = render(
      <ViewTransition viewKey="inbox">
        <div>Inbox</div>
      </ViewTransition>
    )
    expect(screen.getByText("Inbox")).toBeInTheDocument()
    rerender(
      <ViewTransition viewKey="outbox">
        <div>Outbox</div>
      </ViewTransition>
    )
    expect(screen.getByText("Outbox")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/motion/ViewTransition.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

`src/components/motion/ViewTransition.tsx`:
```typescript
import type { ReactNode } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useReducedMotion } from "motion/react"
import { fadeUp, VIEW_DURATION, EASE_OUT } from "@/lib/motion-variants"

interface ViewTransitionProps {
  viewKey: string
  children: ReactNode
}

export function ViewTransition({ viewKey, children }: ViewTransitionProps) {
  const reduceMotion = useReducedMotion()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={viewKey}
        initial={reduceMotion ? false : fadeUp.initial}
        animate={reduceMotion ? undefined : fadeUp.animate}
        exit={reduceMotion ? undefined : fadeUp.exit}
        transition={{ duration: VIEW_DURATION, ease: EASE_OUT }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/motion/ViewTransition.test.tsx`
Expected: `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/motion/ViewTransition.tsx src/components/motion/ViewTransition.test.tsx
git commit -m "Add ViewTransition wrapper"
```

---

### Task 10: EmptyState helper

**Files:**
- Create: `src/components/EmptyState.tsx`
- Test: `src/components/EmptyState.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/EmptyState.test.tsx`:
```typescript
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { EmptyState } from "./EmptyState"

describe("EmptyState", () => {
  it("renders title and subtitle", () => {
    render(<EmptyState title="No faxes" subtitle="Check back later" icon={<span>i</span>} />)
    expect(screen.getByText("No faxes")).toBeInTheDocument()
    expect(screen.getByText("Check back later")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/EmptyState.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

`src/components/EmptyState.tsx`:
```typescript
import type { ReactNode } from "react"
import { motion } from "motion/react"
import { scaleIn } from "@/lib/motion-variants"

interface EmptyStateProps {
  title: string
  subtitle?: string
  icon?: ReactNode
}

export function EmptyState({ title, subtitle, icon }: EmptyStateProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center gap-3 py-20 text-center"
    >
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <p className="text-lg font-semibold">{title}</p>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </motion.div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/EmptyState.test.tsx`
Expected: `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/EmptyState.tsx src/components/EmptyState.test.tsx
git commit -m "Add EmptyState component"
```

---

## Phase 3 — App shell + screens

> Phase 3 tasks apply the primitives from Phase 2. These are wiring/JSX changes verified by `npm run build` (tsc + vite) succeeding and a visual check via `npm run tauri dev`. Each task ends with a commit.

### Task 11: App sidebar — brand mark, active pill, count badge

**Files:**
- Modify: `src/components/app-sidebar.tsx`

- [ ] **Step 1: Rewrite `src/components/app-sidebar.tsx`**

```typescript
import { Users, Send, Inbox, FileText, Plus, Settings } from "lucide-react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  { title: "Inbox", icon: Inbox, view: "inbox" },
  { title: "Outbox", icon: Send, view: "outbox" },
  { title: "Drafts", icon: FileText, view: "drafts" },
  { title: "Contacts", icon: Users, view: "contacts" },
  { title: "Settings", icon: Settings, view: "settings" },
]

interface AppSidebarProps {
  onNavigate: (view: string) => void
  activeView?: string
  inboxCount?: number
}

export function AppSidebar({ onNavigate, activeView, inboxCount = 0 }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-teal-400 to-teal-700" />
              FaxBox
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => onNavigate("newfax")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Send New Fax
              </Button>
            </div>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = activeView === item.view
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => onNavigate(item.view)}
                      className="relative"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active"
                          className="absolute inset-0 rounded-md bg-accent"
                          transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
                        />
                      )}
                      <span className="relative flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.view === "inbox" && inboxCount > 0 && (
                          <span className="ml-auto rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                            {inboxCount}
                          </span>
                        )}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/app-sidebar.tsx
git commit -m "Add brand mark, animated active pill, and inbox count badge to sidebar"
```

---

### Task 12: App shell — ViewTransition wrapper + wire sidebar props

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add imports at top of `src/App.tsx`**

Add after the existing `useState` import line (line 1):
```typescript
import { Inbox as InboxIcon } from "lucide-react"
```
And add with the other component imports (after the `Settings` import, line 27):
```typescript
import { ViewTransition } from "@/components/motion/ViewTransition"
import { StatCard } from "@/components/motion/StatCard"
import { StatusBadge } from "@/components/motion/StatusBadge"
import { StaggerGroup } from "@/components/motion/StaggerGroup"
import { StaggerItem } from "@/components/motion/StaggerItem"
import { EmptyState } from "@/components/EmptyState"
import type { FaxStatus } from "@/lib/status-utils"
```

- [ ] **Step 2: Replace both `AppSidebar` usages to pass `activeView` and `inboxCount`**

In the preview branch (around line 230), change:
```typescript
<AppSidebar onNavigate={() => setPreviewFax(null)} />
```
to:
```typescript
<AppSidebar onNavigate={() => setPreviewFax(null)} activeView={activeView} inboxCount={faxCount} />
```

In the main return (around line 246), change:
```typescript
<AppSidebar onNavigate={(view) => {
```
...keep the handler body, and change the closing to add props. Replace the opening `<AppSidebar onNavigate={(view) => {` ... `}} />` block by adding `activeView={activeView}` and `inboxCount={faxCount}` before the closing `/>`. The simplest reliable edit: add `activeView={activeView}` `inboxCount={faxCount}` attributes inside that `<AppSidebar ...>` tag.

- [ ] **Step 3: Wrap the view-switch block in `ViewTransition`**

Locate the `{activeView === "newfax" ? (` ... `)}` block that switches views (lines ~267–492). Wrap the entire ternary in:
```typescript
<ViewTransition viewKey={activeView}>
  {/* existing ternary here */}
</ViewTransition>
```

- [ ] **Step 4: Replace inbox stat number card with StatCard + add StatusBadge + stagger**

In the inbox branch, replace:
```typescript
<Card className="w-fit">
  <CardContent className="pt-6">
    <div className="text-4xl font-bold">{faxCount}</div>
    <p className="text-sm text-muted-foreground mt-1">
      unprocessed faxes today
    </p>
  </CardContent>
</Card>
```
with:
```typescript
<StatCard value={faxCount} label="unprocessed faxes today" icon={<InboxIcon className="h-4 w-4" />} variant="teal" />
```

Replace the inbox table body:
```typescript
{paginatedFaxes.map((fax) => (
  <TableRow key={fax.id}>
    <TableCell>{fax.status}</TableCell>
    <TableCell>{fax.sender}</TableCell>
    <TableCell>{fax.received}</TableCell>
    <TableCell>{fax.pages}</TableCell>
    <TableCell>
      <Button variant="outline" size="sm" onClick={() => setPreviewFax(fax)}>
        Preview
      </Button>
    </TableCell>
  </TableRow>
))}
```
with:
```typescript
{paginatedFaxes.map((fax) => (
  <StaggerItem key={fax.id} as="tr">
    <TableCell><StatusBadge status={fax.status as FaxStatus} /></TableCell>
    <TableCell>{fax.sender}</TableCell>
    <TableCell>{fax.received}</TableCell>
    <TableCell>{fax.pages}</TableCell>
    <TableCell>
      <Button variant="outline" size="sm" onClick={() => setPreviewFax(fax)}>
        Preview
      </Button>
    </TableCell>
  </StaggerItem>
))}
```
and wrap the `<TableBody>` content by changing `<TableBody>` to `<TableBody asChild><StaggerGroup as="tbody">` ... `</StaggerGroup></TableBody>` — but simpler: keep `<TableBody>` and put `<StaggerGroup>` inside it is invalid for table semantics. Instead, leave `TableBody` and apply stagger by wrapping rows. Since rows already use `StaggerItem`, set the parent variant context by adding `initial="hidden" animate="visible"` + `variants={staggerGroup}` is not directly possible on `TableBody`. 

**Simpler, correct approach:** Do not use StaggerGroup on `<tbody>`. Instead render each row as a `StaggerItem` with its own `fadeUpVariant` and a per-row `transition.delay` computed from index. Replace the map with:
```typescript
{paginatedFaxes.map((fax, index) => (
  <TableRow
    key={fax.id}
    className="group"
    asChild
  >
    <motion.tr
      variants={fadeUpVariant}
      initial="hidden"
      animate="visible"
      custom={index}
      transition={{ duration: ITEM_DURATION, ease: EASE_OUT, delay: index * STAGGER_DELAY }}
    >
      <TableCell><StatusBadge status={fax.status as FaxStatus} /></TableCell>
      <TableCell>{fax.sender}</TableCell>
      <TableCell>{fax.received}</TableCell>
      <TableCell>{fax.pages}</TableCell>
      <TableCell>
        <Button variant="outline" size="sm" onClick={() => setPreviewFax(fax)}>
          Preview
        </Button>
      </TableCell>
    </motion.tr>
  </TableRow>
))}
```
Add to imports: `import { motion } from "motion/react"` and `import { fadeUpVariant, ITEM_DURATION, STAGGER_DELAY, EASE_OUT } from "@/lib/motion-variants"`.

- [ ] **Step 5: Replace outbox stat cards with StatCard + StatusBadge + stagger**

Replace the outbox stat block:
```typescript
<div className="flex gap-6">
  <Card className="w-fit">
    <CardContent className="pt-6">
      <div className="text-4xl font-bold">{sentCount}</div>
      <p className="text-sm text-muted-foreground mt-1">Total Sent</p>
    </CardContent>
  </Card>
  <Card className="w-fit">
    <CardContent className="pt-6">
      <div className="text-4xl font-bold">{failedCount}</div>
      <p className="text-sm text-muted-foreground mt-1">Failed</p>
    </CardContent>
  </Card>
</div>
```
with:
```typescript
<div className="flex gap-6">
  <StatCard value={sentCount} label="Total Sent" icon={<Send className="h-4 w-4" />} variant="teal" />
  <StatCard value={failedCount} label="Failed" icon={<FileText className="h-4 w-4" />} variant="red" />
</div>
```
(Ensure `Send`, `FileText` are imported from `lucide-react` — add if missing.)

Replace the outbox table rows `<TableCell>{fax.status}</TableCell>` with `<TableCell><StatusBadge status={fax.status as FaxStatus} /></TableCell>` and apply the same per-row motion pattern from Step 4 (use the `motion.tr` + `transition.delay` approach).

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: succeeds with no TS errors.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx
git commit -m "Wire ViewTransition, StatCards, StatusBadges, and staggered rows into App shell"
```

---

### Task 13: FaxPreview — fade-in, scan spinner, back transition

**Files:**
- Modify: `src/pages/FaxPreview.tsx`

- [ ] **Step 1: Replace `src/pages/FaxPreview.tsx` content body**

Add imports at top:
```typescript
import { motion } from "motion/react"
import { fadeUp, VIEW_DURATION, EASE_OUT } from "@/lib/motion-variants"
import { Loader2 } from "lucide-react"
```

Wrap the content area `<div className="flex-1 overflow-hidden">` ... `</div>` (the PdfViewer container) in:
```typescript
<motion.div
  className="flex-1 overflow-hidden"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: VIEW_DURATION, ease: EASE_OUT }}
>
  <PdfViewer pdfUrl={pdfUrl} />
</motion.div>
```

In the Scan button, replace the label logic:
```typescript
{scanning ? "Scanning..." : "Scan"}
```
with:
```typescript
{scanning ? (
  <>
    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    Scanning...
  </>
) : (
  <>
    <Scan className="mr-2 h-4 w-4" />
    Scan
  </>
)}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/pages/FaxPreview.tsx
git commit -m "Animate PDF fade-in and scan spinner in FaxPreview"
```

---

### Task 14: Settings — skeleton loading + success slide

**Files:**
- Modify: `src/pages/Settings.tsx`

- [ ] **Step 1: Replace the loading block**

Add import: `import { Skeleton } from "@/components/ui/skeleton"` and `import { motion } from "motion/react"` and `import { fadeUp, VIEW_DURATION, EASE_OUT } from "@/lib/motion-variants"`.

Replace:
```typescript
if (loading) {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">Detecting devices...</p>
    </div>
  )
}
```
with:
```typescript
if (loading) {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Skeleton className="h-8 w-40" />
      <div className="space-y-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-64" />
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Animate the success message**

Replace the message block:
```typescript
{message && (
  <div className={`p-4 rounded-md text-sm ${message.includes("Failed") ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
    {message}
  </div>
)}
```
with:
```typescript
{message && (
  <motion.div
    initial={fadeUp.initial}
    animate={fadeUp.animate}
    transition={{ duration: VIEW_DURATION, ease: EASE_OUT }}
    className={`p-4 rounded-md text-sm ${message.includes("Failed") ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}
  >
    {message}
  </motion.div>
)}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Settings.tsx
git commit -m "Add skeleton loading state and animate save message in Settings"
```

---

### Task 15: SendNewFax — recipient dropdown, attachment stagger, submit states

**Files:**
- Modify: `src/pages/SendNewFax.tsx`

- [ ] **Step 1: Read the current file to locate the recipient search, attachment list, and submit button**

Run: `rg -n "recipient|attachment|submit|Send Fax|coverLetter" src/pages/SendNewFax.tsx`
Read the relevant sections to find exact JSX to wrap.

- [ ] **Step 2: Add imports**

```typescript
import { motion, AnimatePresence } from "motion/react"
import { Loader2, Check } from "lucide-react"
import { fadeUp, fadeUpVariant, ITEM_DURATION, STAGGER_DELAY, EASE_OUT } from "@/lib/motion-variants"
import { StaggerGroup } from "@/components/motion/StaggerGroup"
import { StaggerItem } from "@/components/motion/StaggerItem"
```

- [ ] **Step 3: Animate the recipient search dropdown**

Wrap the existing dropdown results list (the element that shows matching contacts) in:
```typescript
<AnimatePresence>
  {resultsOpen && (
    <motion.ul
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: ITEM_DURATION, ease: EASE_OUT }}
      className="overflow-hidden"
    >
      {/* existing result items */}
    </motion.ul>
  )}
</AnimatePresence>
```
(Use whatever boolean already gates the dropdown visibility; if none exists, gate it on `searchQuery.length > 0 && filteredContacts.length > 0`.)

- [ ] **Step 4: Stagger attachments**

Wrap each attachment item in `<StaggerItem>` and the attachment container in `<StaggerGroup>`:
```typescript
<StaggerGroup>
  {attachments.map((file) => (
    <StaggerItem key={file.id} className="...">
      {/* existing attachment row */}
    </StaggerItem>
  ))}
</StaggerGroup>
```

- [ ] **Step 5: Submit button states**

Add local state (if not present): `const [submitState, setSubmitState] = useState<"idle"|"sending"|"sent">("idle")`. In the submit handler, set `setSubmitState("sending")`, await the save, then `setSubmitState("sent")` briefly before calling `onSave`. Replace the submit button JSX:
```typescript
<Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
  {submitState === "sending" ? (
    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
  ) : submitState === "sent" ? (
    <><Check className="mr-2 h-4 w-4" /> Sent</>
  ) : (
    "Send Fax"
  )}
</Button>
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/pages/SendNewFax.tsx
git commit -m "Animate recipient dropdown, attachment stagger, and submit states in SendNewFax"
```

---

### Task 16: Contacts — initials avatar, stagger, hover lift

**Files:**
- Modify: `src/pages/Contacts.tsx`

- [ ] **Step 1: Read current file**

Run: `rg -n "TableRow|TableCell|map|contacts" src/pages/Contacts.tsx`

- [ ] **Step 2: Add imports**

```typescript
import { motion } from "motion/react"
import { fadeUpVariant, ITEM_DURATION, STAGGER_DELAY, EASE_OUT } from "@/lib/motion-variants"
import { cn } from "@/lib/utils"
```

- [ ] **Step 3: Add an initials helper**

At the top of the file (after imports):
```typescript
function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}
```

- [ ] **Step 4: Render avatar + staggered rows**

In the first column cell of each contact row, add before the name:
```typescript
<span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
  {initials(contact.fullName)}
</span>
```

Wrap each `<TableRow>` content in a `motion.tr` with the index-based delay pattern (same as App.tsx Task 12 Step 4):
```typescript
{contacts.map((contact, index) => (
  <TableRow key={contact.id} asChild>
    <motion.tr
      variants={fadeUpVariant}
      initial="hidden"
      animate="visible"
      transition={{ duration: ITEM_DURATION, ease: EASE_OUT, delay: index * STAGGER_DELAY }}
      className="transition-transform hover:-translate-y-0.5"
    >
      {/* existing cells, with avatar added in the name cell */}
    </motion.tr>
  </TableRow>
))}
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Contacts.tsx
git commit -m "Add initials avatars, staggered rows, and hover lift to Contacts"
```

---

### Task 17: AddNewContact — section reveal + save animation

**Files:**
- Modify: `src/pages/AddNewContact.tsx`

- [ ] **Step 1: Read current file**

Run: `rg -n "form|onSubmit|Save|button" src/pages/AddNewContact.tsx`

- [ ] **Step 2: Add imports + wrap the form in a reveal**

```typescript
import { motion } from "motion/react"
import { fadeUp, VIEW_DURATION, EASE_OUT } from "@/lib/motion-variants"
```
Wrap the returned form root in:
```typescript
<motion.div
  initial={fadeUp.initial}
  animate={fadeUp.animate}
  transition={{ duration: VIEW_DURATION, ease: EASE_OUT }}
>
  {/* existing form */}
</motion.div>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/pages/AddNewContact.tsx
git commit -m "Animate section reveal on AddNewContact"
```

---

## Phase 4 — Docs + final verification

### Task 18: Update AGENTS.md to reflect actual stack

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Fix the outdated stack section**

In `AGENTS.md`, find the line under "Styling Conventions":
> - Use regular CSS files (no CSS modules or Tailwind configured)

Replace with:
> - Tailwind CSS v4 (via `@tailwindcss/vite`) + shadcn/ui (new-york style). Global tokens in `src/index.css` using `@theme inline` and CSS custom properties.
> - Motion library `motion` (import from `motion/react`) for animations. Shared primitives in `src/components/motion/`.

In "Development Commands", add after the build commands:
> - `npm run test` - Run Vitest test suite (React Testing Library)

In "No explicit test setup", replace the note with:
> - Tests use Vitest + React Testing Library. Config in `vitest.config.ts`, setup in `src/test/setup.ts`. New components follow TDD: write the test first in `*.test.tsx` next to the component.

- [ ] **Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "Update AGENTS.md to reflect Tailwind v4, shadcn, motion, and Vitest"
```

---

### Task 19: Full verification

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: all tests pass (variants, status-utils, count-up, StatusBadge, StatCard, Stagger, ViewTransition, EmptyState).

- [ ] **Step 2: TypeScript + build**

Run: `npm run build`
Expected: tsc + vite build succeeds, no errors.

- [ ] **Step 3: Manual visual check**

Run: `npm run tauri dev`
Verify:
- Teal palette applied (buttons, focus rings, sidebar brand)
- Status badges colored correctly; "Sending" dot pulses
- StatCard numbers count up on view load
- View swaps fade+slide; sidebar active pill slides between items
- Reduced motion: set OS reduce-motion → confirm instant swaps

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "Fixes from final verification pass"
```

---

## Self-Review (completed by plan author)

**1. Spec coverage:**
- §1 Color system → Task 5 ✓
- §2.1 motion-variants → Task 2 ✓
- §2.2 ViewTransition → Task 9 ✓
- §2.3 StatusBadge → Task 6 (+ Task 3 status-utils) ✓
- §2.4 StatCard → Task 7 (+ Task 4 count-up) ✓
- §2.5 StaggerGroup/Item → Task 8 ✓
- §3 Animation spec → encoded in variants (Task 2) + reduced-motion (Task 5) + per-primitive transitions ✓
- §4 Per-screen: shell (12), Inbox/Outbox (12), SendNewFax (15), Contacts (16), AddNewContact (17), Settings (14), FaxPreview (13) ✓
- §5 Dependencies → Task 1 ✓
- §6 File org → all files present in tasks ✓
- §7 TDD → Phase 1–2 tasks are TDD; Phase 3 wiring verified by build ✓
- §8 Out of scope respected (no router, no data changes, no Remotion) ✓

**2. Placeholder scan:** One known loose end flagged inline — Task 2's `staggerGroup.animate.staggerChildren` assertion; corrected to read `variants.visible.transition.staggerChildren` in the same task. No TBDs remain. Phase 3 tasks reference reading current JSX via `rg` before editing because exact line numbers shift as earlier tasks land; this is intentional for robustness.

**3. Type consistency:** `FaxStatus` defined Task 3, used Tasks 6 & 12. `StatusConfig`, `getStatusConfig`, `STATUS_CONFIG` consistent. `useCountUp(target, {duration})` signature consistent Tasks 4 & 7. Variant names `fadeUp`/`scaleIn`/`fadeUpVariant`/`staggerGroup` consistent Tasks 2/6/7/8/9/13/14/17. `viewKey` prop on ViewTransition consistent Tasks 9 & 12.
