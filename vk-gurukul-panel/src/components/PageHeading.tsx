"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageHeadingProps {
  title: string
  onBack?: () => void
  subtitle?: string
  actions?: React.ReactNode
}

const PageHeading: React.FC<PageHeadingProps> = ({ title, onBack, subtitle, actions }) => {
  const router = useRouter()

  // If onBack is not provided, use default router.back()
  const handleBack = onBack || (() => router.back())

  return (
    <div className="flex items-center justify-between ">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={handleBack}
          aria-label="Go Back"
          className="h-8 w-8 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export default PageHeading
