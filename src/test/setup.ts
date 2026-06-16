import "@testing-library/jest-dom/vitest"
import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"

let rafId = 0
const rafQueue: Array<(t: number) => void> = []
globalThis.requestAnimationFrame = (cb: (t: number) => void) => {
  const id = ++rafId
  rafQueue.push(cb)
  setTimeout(() => {
    const i = rafQueue.indexOf(cb)
    if (i >= 0) rafQueue.splice(i, 1)
    cb(performance.now())
  }, 0)
  return id
}
globalThis.cancelAnimationFrame = (id: number) => {
  const cb = rafQueue[id - 1]
  if (cb) {
    const i = rafQueue.indexOf(cb)
    if (i >= 0) rafQueue.splice(i, 1)
  }
}

afterEach(() => {
  cleanup()
})
