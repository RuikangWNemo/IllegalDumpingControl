"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AccessibilitySettings {
  elderlyMode: boolean
  fontSize: "normal" | "large" | "extra-large"
  highContrast: boolean
  colorBlindSafe: boolean
  reduceMotion: boolean
  voiceEnabled: boolean
  selectedLanguage: "zh-CN" | "zh-dialect" | "en-US"
  autoVolumeAdjust: boolean
  blinkingAlerts: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSettings: (updates: Partial<AccessibilitySettings>) => void
  speak: (text: string) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    elderlyMode: false,
    fontSize: "normal",
    highContrast: false,
    colorBlindSafe: false,
    reduceMotion: false,
    voiceEnabled: true,
    selectedLanguage: "en-US",
    autoVolumeAdjust: true,
    blinkingAlerts: true,
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibility-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem("accessibility-settings", JSON.stringify(settings))

    // Apply CSS classes based on settings
    const root = document.documentElement

    // Font size
    root.classList.remove("font-large", "font-extra-large")
    if (settings.fontSize === "large") root.classList.add("font-large")
    if (settings.fontSize === "extra-large") root.classList.add("font-extra-large")

    // High contrast
    root.classList.toggle("high-contrast", settings.highContrast)

    // Color blind safe
    root.classList.toggle("color-blind-safe", settings.colorBlindSafe)

    // Reduce motion
    root.classList.toggle("reduce-motion", settings.reduceMotion)

    // Elderly mode
    root.classList.toggle("elderly-mode", settings.elderlyMode)
  }, [settings])

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }

  const speak = (text: string) => {
    if (!settings.voiceEnabled || typeof window === "undefined") return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    // Set language based on settings
    switch (settings.selectedLanguage) {
      case "zh-CN":
        utterance.lang = "zh-CN"
        break
      case "zh-dialect":
        utterance.lang = "zh-CN"
        utterance.voice =
          window.speechSynthesis
            .getVoices()
            .find((voice) => voice.lang.includes("zh") && voice.name.includes("dialect")) || null
        break
      case "en-US":
        utterance.lang = "en-US"
        break
    }

    // Adjust volume based on time if auto-adjust is enabled
    if (settings.autoVolumeAdjust) {
      const hour = new Date().getHours()
      if (hour >= 22 || hour <= 6) {
        utterance.volume = 0.3 // Lower volume at night
      } else {
        utterance.volume = 0.7
      }
    } else {
      utterance.volume = 0.7
    }

    utterance.rate = settings.elderlyMode ? 0.8 : 1.0 // Slower speech for elderly mode
    utterance.pitch = 1.0

    window.speechSynthesis.speak(utterance)
  }

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, speak }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
