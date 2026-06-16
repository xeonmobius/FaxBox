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
