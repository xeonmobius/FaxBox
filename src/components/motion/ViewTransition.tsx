import type { ReactNode } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { fadeUp, VIEW_DURATION, EASE_OUT } from "@/lib/motion-variants"

interface ViewTransitionProps {
  viewKey: string
  children: ReactNode
}

export function ViewTransition({ viewKey, children }: ViewTransitionProps) {
  const reduceMotion = useReducedMotion()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={viewKey}
        initial={reduceMotion ? false : fadeUp.initial}
        animate={reduceMotion ? undefined : fadeUp.animate}
        exit={reduceMotion ? undefined : fadeUp.exit}
        transition={{ duration: VIEW_DURATION, ease: EASE_OUT }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
