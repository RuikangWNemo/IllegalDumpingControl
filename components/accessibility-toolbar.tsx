"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accessibility, Volume2, Eye, Type, Palette, Settings, X, Languages } from "lucide-react"
import { useAccessibility } from "@/components/accessibility-provider"

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { settings, updateSettings, speak } = useAccessibility()

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      speak("Accessibility settings panel opened")
    }
  }

  const handleSettingChange = (key: string, value: any) => {
    updateSettings({ [key]: value })

    // Provide voice feedback for important changes
    switch (key) {
      case "elderlyMode":
        speak(value ? "Senior-friendly mode enabled" : "Senior-friendly mode disabled")
        break
      case "fontSize":
        speak(
          `Font size adjusted to ${value === "large" ? "large" : value === "extra-large" ? "extra large" : "normal"}`,
        )
        break
      case "highContrast":
        speak(value ? "High contrast mode enabled" : "High contrast mode disabled")
        break
      case "voiceEnabled":
        if (value) speak("Voice announcements enabled")
        break
    }
  }

  return (
    <>
      {/* Accessibility Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggle}
        className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 p-0 shadow-lg bg-transparent"
        aria-label="Open accessibility settings"
      >
        <Accessibility className="w-5 h-5" />
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 z-50 w-80 glass shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-primary" />
                <h3 className="font-medium">Accessibility Settings</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Senior-Friendly Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Senior-Friendly Mode</span>
                </div>
                <Switch
                  checked={settings.elderlyMode}
                  onCheckedChange={(checked) => handleSettingChange("elderlyMode", checked)}
                />
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Font Size</span>
                </div>
                <Select value={settings.fontSize} onValueChange={(value) => handleSettingChange("fontSize", value)}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="extra-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">High Contrast</span>
                </div>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => handleSettingChange("highContrast", checked)}
                />
              </div>

              {/* Color Blind Friendly */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Color Blind Friendly</span>
                </div>
                <Switch
                  checked={settings.colorBlindSafe}
                  onCheckedChange={(checked) => handleSettingChange("colorBlindSafe", checked)}
                />
              </div>

              {/* Reduce Motion */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Reduce Motion</span>
                </div>
                <Switch
                  checked={settings.reduceMotion}
                  onCheckedChange={(checked) => handleSettingChange("reduceMotion", checked)}
                />
              </div>

              {/* Voice Announcements */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Voice Announcements</span>
                </div>
                <Switch
                  checked={settings.voiceEnabled}
                  onCheckedChange={(checked) => handleSettingChange("voiceEnabled", checked)}
                />
              </div>

              {/* Language Selection */}
              {settings.voiceEnabled && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Voice Language</span>
                  </div>
                  <Select
                    value={settings.selectedLanguage}
                    onValueChange={(value) => handleSettingChange("selectedLanguage", value)}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh-CN">Chinese Mandarin</SelectItem>
                      <SelectItem value="zh-dialect">Chinese Dialect</SelectItem>
                      <SelectItem value="en-US">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Auto Volume Adjust */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Auto Volume Adjust</span>
                </div>
                <Switch
                  checked={settings.autoVolumeAdjust}
                  onCheckedChange={(checked) => handleSettingChange("autoVolumeAdjust", checked)}
                />
              </div>

              {/* Blinking Alerts */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Blinking Alerts</span>
                </div>
                <Switch
                  checked={settings.blinkingAlerts}
                  onCheckedChange={(checked) => handleSettingChange("blinkingAlerts", checked)}
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => speak("This is a voice announcement test")}
                className="w-full"
                disabled={!settings.voiceEnabled}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Test Voice Announcement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
