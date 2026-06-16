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

  it("group renders a wrapping element", () => {
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
