import type { ElementType, ReactNode } from "react"
import { motion } from "motion/react"
import { staggerGroup } from "@/lib/motion-variants"
import { cn } from "@/lib/utils"

interface StaggerGroupProps {
  children: ReactNode
  as?: ElementType
  className?: string
}

export function StaggerGroup({ children, as, className }: StaggerGroupProps) {
  const Tag = (as ? (motion as unknown as Record<string, ElementType>)[as as string] : motion.div) ?? motion.div
  const MotionTag = Tag as ElementType
  return (
    <MotionTag
      initial="hidden"
      animate="visible"
      variants={staggerGroup.variants}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  )
}
