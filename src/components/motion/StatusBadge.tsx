import { motion } from "motion/react"
import { getStatusConfig, type FaxStatus } from "@/lib/status-utils"
import { scaleIn } from "@/lib/motion-variants"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: FaxStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = getStatusConfig(status)
  return (
    <motion.span
      data-testid="status-badge"
      data-status={status}
      variants={scaleIn}
      initial="initial"
      animate="animate"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        config.badgeClass,
        className
      )}
    >
      <span
        data-testid="status-dot"
        className={cn("h-1.5 w-1.5 rounded-full", config.dotClass, config.pulse && "animate-status-pulse")}
      />
      {config.label}
    </motion.span>
  )
}
