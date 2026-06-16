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

  it("staggerGroup staggers visible children by STAGGER_DELAY", () => {
    const visibleVariant = (staggerGroup as unknown as { variants: Record<string, { transition: { staggerChildren: number } }> }).variants.visible
    expect(visibleVariant.transition.staggerChildren).toBe(STAGGER_DELAY)
    expect(staggerGroup.initial).toBe("hidden")
    expect(staggerGroup.animate).toBe("visible")
  })
})
