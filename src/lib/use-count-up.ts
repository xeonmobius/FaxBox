import { useEffect, useState } from "react"
import { useReducedMotion } from "motion/react"

export function useCountUp(target: number, options: { duration?: number } = {}): number {
  const { duration = 600 } = options
  const reduceMotion = useReducedMotion()
  const [value, setValue] = useState(0)

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
      if (current >= steps) {
        window.clearInterval(interval)
        setValue(target)
      }
    }, stepDuration)
    return () => window.clearInterval(interval)
  }, [target, duration, reduceMotion])

  return value
}
