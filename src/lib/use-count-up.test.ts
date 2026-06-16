import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"

vi.mock("motion/react", () => ({
  useReducedMotion: vi.fn(() => false),
}))

import { useReducedMotion } from "motion/react"
import { useCountUp } from "./use-count-up"

describe("useCountUp", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.mocked(useReducedMotion).mockReturnValue(false)
  })

  it("returns the target instantly when reduced motion is requested", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    const { result } = renderHook(() => useCountUp(42, { duration: 600 }))
    expect(result.current).toBe(42)
  })

  it("starts at 0 and reaches the target after the duration", () => {
    const { result } = renderHook(() => useCountUp(42, { duration: 600 }))
    expect(result.current).toBe(0)
    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(result.current).toBe(42)
  })
})
