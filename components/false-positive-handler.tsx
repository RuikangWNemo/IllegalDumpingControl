"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CheckCircle, X, ChevronDown } from "lucide-react"

interface FalsePositiveHandlerProps {
  eventId: string
  onMarkFalsePositive: (eventId: string, reason: string) => void
  onMarkResolved: (eventId: string) => void
}

const FALSE_POSITIVE_REASONS = [
  { value: "cat_dog", label: "猫/狗等动物" },
  { value: "delivery_box", label: "快递包裹" },
  { value: "passerby", label: "路人经过" },
  { value: "maintenance", label: "维护人员" },
  { value: "wind_debris", label: "风吹垃圾" },
  { value: "shadow_lighting", label: "阴影/光照" },
  { value: "other", label: "其他原因" },
]

export function FalsePositiveHandler({ eventId, onMarkFalsePositive, onMarkResolved }: FalsePositiveHandlerProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFalsePositive = async (reason: string) => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
    onMarkFalsePositive(eventId, reason)
    setIsProcessing(false)
  }

  const handleResolved = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
    onMarkResolved(eventId)
    setIsProcessing(false)
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        className="text-xs h-7 bg-transparent"
        onClick={handleResolved}
        disabled={isProcessing}
      >
        <CheckCircle className="w-3 h-3 mr-1" />
        标记已处理
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent" disabled={isProcessing}>
            <X className="w-3 h-3 mr-1" />
            误报
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {FALSE_POSITIVE_REASONS.map((reason) => (
            <DropdownMenuItem key={reason.value} onClick={() => handleFalsePositive(reason.value)} className="text-sm">
              {reason.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
