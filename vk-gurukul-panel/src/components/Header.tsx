"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function Header() {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])
  if (!isMounted) return null

  const hiddenSegments = ["secured"]
  const pathParts = pathname
    .split("/")
    .filter((part) => part && !hiddenSegments.includes(part.toLowerCase()))

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <span className="text-gray-600">Home</span>
        </BreadcrumbItem>

        {pathParts.map((part, index) => {
          const isLast = index === pathParts.length - 1
          const label = decodeURIComponent(part.replace(/-/g, " "))

          return (
            <div key={index} className="flex items-center">
              <BreadcrumbSeparator /> {/* Place between items */}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="capitalize">{label}</BreadcrumbPage>
                ) : (
                  <span className="capitalize text-gray-600">{label}</span>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
