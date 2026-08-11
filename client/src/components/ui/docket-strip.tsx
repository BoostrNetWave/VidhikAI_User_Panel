import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export interface DocketStripProps extends React.HTMLAttributes<HTMLDivElement> {
  recordId: string
  title: string
  status: string
  statusColor?: "success" | "warning" | "destructive" | "default" | "muted"
  actionText?: string
  onAction?: () => void
  leftComponent?: React.ReactNode
}

const statusColors = {
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  muted: "bg-muted",
  default: "bg-primary"
}

const badgeVariants = {
  success: "bg-success text-success-foreground hover:bg-success/80",
  warning: "bg-warning text-warning-foreground hover:bg-warning/80",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
  muted: "bg-muted text-muted-foreground hover:bg-muted/80",
  default: "bg-primary text-primary-foreground hover:bg-primary/80"
}

const DocketStrip = React.forwardRef<HTMLDivElement, DocketStripProps>(
  ({ className, recordId, title, status, statusColor = "default", actionText, onAction, leftComponent, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group relative flex items-center gap-4 rounded-md border border-border bg-surface px-4 py-3 shadow-sm transition-colors hover:bg-muted/30",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-[3px] rounded-l-md",
            statusColors[statusColor]
          )}
        />
        {leftComponent && <div className="shrink-0">{leftComponent}</div>}
        <div className="flex w-32 shrink-0 items-center">
          <span className="font-mono text-sm font-medium text-muted-foreground">{recordId}</span>
        </div>
        <div className="flex-1 truncate">
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <Badge className={cn("rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase", badgeVariants[statusColor])}>
            {status}
          </Badge>
          {actionText && (
            <button
              onClick={onAction}
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-sm"
            >
              {actionText} <span aria-hidden="true">&rarr;</span>
            </button>
          )}
        </div>
      </div>
    )
  }
)
DocketStrip.displayName = "DocketStrip"

export { DocketStrip }
