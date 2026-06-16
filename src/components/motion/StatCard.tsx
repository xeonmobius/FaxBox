import type { ReactNode } from "react"
import { motion } from "motion/react"
import { useCountUp } from "@/lib/use-count-up"
import { fadeUp } from "@/lib/motion-variants"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  value: number
  label: string
  icon: ReactNode
  variant?: "teal" | "red"
}

const iconVariant: Record<NonNullable<StatCardProps["variant"]>, string> = {
  teal: "bg-teal-100 text-teal-700",
  red: "bg-red-50 text-red-600",
}

export function StatCard({ value, label, icon, variant = "teal" }: StatCardProps) {
  const display = useCountUp(value, { duration: 600 })
  return (
    <motion.div variants={fadeUp} initial="initial" animate="animate">
      <Card className="w-fit">
        <CardContent className="flex items-center gap-3 pt-6">
          <span
            data-testid="stat-icon"
            className={cn("flex h-9 w-9 items-center justify-center rounded-lg", iconVariant[variant])}
          >
            {icon}
          </span>
          <div>
            <div data-testid="stat-value" className="text-3xl font-bold leading-none">
              {display}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
