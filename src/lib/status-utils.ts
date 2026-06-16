export type FaxStatus = "New" | "Viewed" | "Sent" | "Sending" | "Failed"

export interface StatusConfig {
  label: string
  dotClass: string
  badgeClass: string
  pulse: boolean
}

export const STATUS_CONFIG: Record<FaxStatus, StatusConfig> = {
  New: {
    label: "New",
    dotClass: "bg-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700",
    pulse: false,
  },
  Viewed: {
    label: "Viewed",
    dotClass: "bg-slate-400",
    badgeClass: "bg-slate-100 text-slate-600",
    pulse: false,
  },
  Sent: {
    label: "Sent",
    dotClass: "bg-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700",
    pulse: false,
  },
  Sending: {
    label: "Sending",
    dotClass: "bg-amber-500",
    badgeClass: "bg-amber-50 text-amber-700",
    pulse: true,
  },
  Failed: {
    label: "Failed",
    dotClass: "bg-red-500",
    badgeClass: "bg-red-50 text-red-700",
    pulse: false,
  },
}

export function getStatusConfig(status: FaxStatus): StatusConfig {
  return STATUS_CONFIG[status]
}
