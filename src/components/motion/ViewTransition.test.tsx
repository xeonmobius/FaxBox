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

  it("swaps content when viewKey changes", () => {
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
