import type { ElementType, ReactNode } from "react"
import { motion } from "motion/react"
import { fadeUpVariant } from "@/lib/motion-variants"
import { cn } from "@/lib/utils"

interface StaggerItemProps {
  children: ReactNode
  as?: ElementType
  className?: string
}

export function StaggerItem({ children, as, className }: StaggerItemProps) {
  const Tag = (as ? (motion as unknown as Record<string, ElementType>)[as as string] : motion.div) ?? motion.div
  const MotionTag = Tag as ElementType
  return (
    <MotionTag variants={fadeUpVariant} className={cn(className)}>
      {children}
    </MotionTag>
  )
}
