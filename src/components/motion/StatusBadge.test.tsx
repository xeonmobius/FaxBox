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
