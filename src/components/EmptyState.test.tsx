import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { EmptyState } from "./EmptyState"

describe("EmptyState", () => {
  it("renders title and subtitle", () => {
    render(<EmptyState title="No faxes" subtitle="Check back later" icon={<span>i</span>} />)
    expect(screen.getByText("No faxes")).toBeInTheDocument()
    expect(screen.getByText("Check back later")).toBeInTheDocument()
  })

  it("renders without a subtitle", () => {
    render(<EmptyState title="Nothing here" />)
    expect(screen.getByText("Nothing here")).toBeInTheDocument()
  })

  it("renders the icon when provided", () => {
    render(<EmptyState title="x" icon={<span data-testid="ic">i</span>} />)
    expect(screen.getByTestId("ic")).toBeInTheDocument()
  })
})
