"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Volume2 } from "lucide-react"
import { useAccessibility } from "@/components/accessibility-provider"

interface EnhancedAlertProps {
  title: string
  message: string
  severity: "low" | "medium" | "high"
  onDismiss?: () => void
}

export function EnhancedAlert({ title, message, severity, onDismiss }: EnhancedAlertProps) {
  const { settings, speak } = useAccessibility()
  const [isVisible, setIsVisible] = useState(true)
  const [shouldBlink, setShouldBlink] = useState(false)

  useEffect(() => {
    // Announce alert via voice
    if (settings.voiceEnabled) {
      const announcement = `${severity === "high" ? "紧急警报" : "系统提醒"}: ${title}. ${message}`
      speak(announcement)
    }

    // Enable blinking for high severity alerts if setting is enabled
    if (severity === "high" && settings.blinkingAlerts) {
      setShouldBlink(true)
      const blinkInterval = setInterval(() => {
        setShouldBlink((prev) => !prev)
      }, 1000)

      // Stop blinking after 10 seconds
      setTimeout(() => {
        clearInterval(blinkInterval)
        setShouldBlink(false)
      }, 10000)

      return () => clearInterval(blinkInterval)
    }
  }, [title, message, severity, settings.voiceEnabled, settings.blinkingAlerts, speak])

  if (!isVisible) return null

  const getSeverityStyles = () => {
    switch (severity) {
      case "high":
        return "border-red-500 bg-red-500/10 text-red-400"
      case "medium":
        return "border-yellow-500 bg-yellow-500/10 text-yellow-400"
      case "low":
        return "border-blue-500 bg-blue-500/10 text-blue-400"
      default:
        return "border-gray-500 bg-gray-500/10 text-gray-400"
    }
  }

  return (
    <Alert
      className={`
        ${getSeverityStyles()} 
        ${shouldBlink ? "animate-pulse" : ""} 
        ${settings.elderlyMode ? "text-lg p-6" : ""}
        transition-all duration-200
      `}
      role="alert"
      aria-live={severity === "high" ? "assertive" : "polite"}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className={`w-5 h-5 mt-0.5 ${settings.elderlyMode ? "w-6 h-6" : ""}`} />
        <div className="flex-1">
          <div className="font-medium mb-1">{title}</div>
          <AlertDescription className={settings.elderlyMode ? "text-base" : ""}>{message}</AlertDescription>
        </div>
        {settings.voiceEnabled && <Volume2 className="w-4 h-4 text-muted-foreground" aria-label="语音播报已启用" />}
      </div>
    </Alert>
  )
}
