import { Badge } from "@/components/ui/badge"
import { OrderStatus, PaymentStatus } from "@/app/lib/admin/types"

interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus
  type?: "order" | "payment"
}

export function StatusBadge({ status, type = "order" }: StatusBadgeProps) {
  const getVariant = () => {
    if (type === "payment") {
      switch (status) {
        case "COMPLETED":
          return "default" // will style as success
        case "PENDING":
        case "PROCESSING":
          return "secondary" // will style as warning
        case "FAILED":
        case "REFUNDED":
          return "destructive"
        default:
          return "outline"
      }
    }
    
    // Order status
    switch (status) {
      case "DELIVERED":
        return "default" // success
      case "PROCESSING":
      case "SHIPPED":
        return "secondary" // info
      case "PENDING":
        return "outline" // warning
      case "CANCELLED":
      case "REFUNDED":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getClassName = () => {
    if (type === "payment") {
      switch (status) {
        case "COMPLETED":
          return "bg-success text-success-foreground hover:bg-success/90"
        case "PENDING":
          return "bg-warning text-warning-foreground hover:bg-warning/90"
        case "PROCESSING":
          return "bg-info text-info-foreground hover:bg-info/90"
        default:
          return ""
      }
    }
    
    switch (status) {
      case "DELIVERED":
        return "bg-success text-success-foreground hover:bg-success/90"
      case "PROCESSING":
      case "SHIPPED":
        return "bg-info text-info-foreground hover:bg-info/90"
      case "PENDING":
        return "bg-warning text-warning-foreground hover:bg-warning/90"
      default:
        return ""
    }
  }

  return (
    <Badge variant={getVariant()} className={getClassName()}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  )
}