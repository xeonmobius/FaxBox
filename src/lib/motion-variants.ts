import type { MotionProps, Variants } from "motion/react"

export const EASE_OUT = [0.16, 1, 0.3, 1] as const
export const VIEW_DURATION = 0.22
export const ITEM_DURATION = 0.18
export const STAGGER_DELAY = 0.04

export const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
} as const

export const scaleIn = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
} as const

export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: ITEM_DURATION, ease: EASE_OUT } },
}

export const staggerGroup: Pick<MotionProps, "initial" | "animate" | "variants"> = {
  initial: "hidden",
  animate: "visible",
  variants: {
    hidden: {},
    visible: { transition: { staggerChildren: STAGGER_DELAY } },
  },
}
