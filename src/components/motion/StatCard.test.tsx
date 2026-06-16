import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("@/lib/use-count-up", () => ({
  useCountUp: (target: number) => target,
}))

import { StatCard } from "./StatCard"

describe("StatCard", () => {
  it("renders the label", () => {
    render(<StatCard value={5} label="new faxes today" icon={<span>i</span>} />)
    expect(screen.getByText("new faxes today")).toBeInTheDocument()
  })

  it("shows the value", () => {
    render(<StatCard value={42} label="count" icon={<span>i</span>} />)
    expect(screen.getByTestId("stat-value")).toHaveTextContent("42")
  })

  it("applies the teal variant icon classes by default", () => {
    const { container } = render(<StatCard value={1} label="x" icon={<span>i</span>} />)
    expect(container.querySelector("[data-testid='stat-icon']")?.className).toContain("bg-teal-100")
  })

  it("applies the red variant icon classes", () => {
    const { container } = render(<StatCard value={1} label="x" icon={<span>i</span>} variant="red" />)
    expect(container.querySelector("[data-testid='stat-icon']")?.className).toContain("bg-red-50")
  })
})
