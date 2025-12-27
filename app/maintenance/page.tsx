import { Wrench } from "lucide-react"
import Image from "next/image"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Son of God"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <Wrench className="h-16 w-16 text-primary" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight">
          Under Maintenance
        </h1>

        {/* Description */}
        <p className="text-lg text-muted-foreground">
          We're currently performing scheduled maintenance to improve your shopping experience. 
          We'll be back shortly!
        </p>

        {/* Additional info */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            For urgent inquiries, please contact us at{" "}
            <a
              href="mailto:support@sonofgod.com"
              className="text-primary hover:underline"
            >
              support@sonofgod.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}