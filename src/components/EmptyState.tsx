import type { ReactNode } from "react"
import { motion } from "motion/react"
import { scaleIn } from "@/lib/motion-variants"

interface EmptyStateProps {
  title: string
  subtitle?: string
  icon?: ReactNode
}

export function EmptyState({ title, subtitle, icon }: EmptyStateProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center gap-3 py-20 text-center"
    >
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <p className="text-lg font-semibold">{title}</p>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </motion.div>
  )
}
