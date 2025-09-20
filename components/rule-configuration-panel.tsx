"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MapPin, Settings, Calendar, Volume2, Camera, Save, RotateCcw, Plus, Trash2 } from "lucide-react"

interface MonitoringLocation {
  id: string
  name: string
  isActive: boolean
  openTime: string
  closeTime: string
  confidenceThreshold: number
  durationThreshold: number
  nightModeEnabled: boolean
  volumeLevel: number
}

interface HolidayException {
  id: string
  name: string
  date: string
  isActive: boolean
}

export function RuleConfigurationPanel() {
  const [locations, setLocations] = useState<MonitoringLocation[]>([
    {
      id: "loc_001",
      name: "社区垃圾站A",
      isActive: true,
      openTime: "06:00",
      closeTime: "22:00",
      confidenceThreshold: 85,
      durationThreshold: 10,
      nightModeEnabled: true,
      volumeLevel: 70,
    },
    {
      id: "loc_002",
      name: "社区垃圾站B",
      isActive: true,
      openTime: "07:00",
      closeTime: "21:00",
      confidenceThreshold: 80,
      durationThreshold: 15,
      nightModeEnabled: false,
      volumeLevel: 60,
    },
    {
      id: "loc_003",
      name: "社区垃圾站C",
      isActive: false,
      openTime: "06:30",
      closeTime: "22:30",
      confidenceThreshold: 90,
      durationThreshold: 8,
      nightModeEnabled: true,
      volumeLevel: 80,
    },
  ])

  const [holidays, setHolidays] = useState<HolidayException[]>([
    {
      id: "holiday_001",
      name: "春节",
      date: "2025-01-29",
      isActive: true,
    },
    {
      id: "holiday_002",
      name: "国庆节",
      date: "2025-10-01",
      isActive: true,
    },
  ])

  const [globalSettings, setGlobalSettings] = useState({
    autoAdjustVolume: true,
    nightVolumeReduction: 50,
    blinkingLightEnabled: true,
    elderlyModeEnabled: false,
    multiLanguageEnabled: true,
    selectedLanguages: ["zh-CN", "en-US"],
  })

  const updateLocation = (locationId: string, updates: Partial<MonitoringLocation>) => {
    setLocations((prev) => prev.map((loc) => (loc.id === locationId ? { ...loc, ...updates } : loc)))
  }

  const addHoliday = () => {
    const newHoliday: HolidayException = {
      id: `holiday_${Date.now()}`,
      name: "新节假日",
      date: new Date().toISOString().split("T")[0],
      isActive: true,
    }
    setHolidays((prev) => [...prev, newHoliday])
  }

  const removeHoliday = (holidayId: string) => {
    setHolidays((prev) => prev.filter((h) => h.id !== holidayId))
  }

  const updateHoliday = (holidayId: string, updates: Partial<HolidayException>) => {
    setHolidays((prev) => prev.map((h) => (h.id === holidayId ? { ...h, ...updates } : h)))
  }

  const saveConfiguration = () => {
    // Simulate saving configuration
    console.log("Saving configuration...", { locations, holidays, globalSettings })
    // Show success message
  }

  const resetToDefaults = () => {
    // Reset to default values
    console.log("Resetting to defaults...")
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="locations" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            监控点位
          </TabsTrigger>
          <TabsTrigger value="schedules" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            时间规则
          </TabsTrigger>
          <TabsTrigger value="thresholds" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            检测阈值
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            无障碍设置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="locations" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                监控点位管理
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {locations.map((location) => (
                <Card key={location.id} className="border-l-4 border-l-primary/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{location.name}</h3>
                        <Badge variant={location.isActive ? "default" : "secondary"}>
                          {location.isActive ? "启用" : "禁用"}
                        </Badge>
                      </div>
                      <Switch
                        checked={location.isActive}
                        onCheckedChange={(checked) => updateLocation(location.id, { isActive: checked })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>开放时间</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={location.openTime}
                            onChange={(e) => updateLocation(location.id, { openTime: e.target.value })}
                            className="bg-background/50"
                          />
                          <span className="text-muted-foreground">至</span>
                          <Input
                            type="time"
                            value={location.closeTime}
                            onChange={(e) => updateLocation(location.id, { closeTime: e.target.value })}
                            className="bg-background/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>夜间模式</Label>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={location.nightModeEnabled}
                            onCheckedChange={(checked) => updateLocation(location.id, { nightModeEnabled: checked })}
                          />
                          <span className="text-sm text-muted-foreground">
                            {location.nightModeEnabled ? "已启用" : "已禁用"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                节假日例外设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">配置节假日期间的特殊监控规则</p>
                <Button onClick={addHoliday} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  添加节假日
                </Button>
              </div>

              {holidays.map((holiday) => (
                <Card key={holiday.id} className="border-l-4 border-l-secondary/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <Input
                          value={holiday.name}
                          onChange={(e) => updateHoliday(holiday.id, { name: e.target.value })}
                          className="bg-background/50 max-w-32"
                        />
                        <Input
                          type="date"
                          value={holiday.date}
                          onChange={(e) => updateHoliday(holiday.id, { date: e.target.value })}
                          className="bg-background/50"
                        />
                        <Switch
                          checked={holiday.isActive}
                          onCheckedChange={(checked) => updateHoliday(holiday.id, { isActive: checked })}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHoliday(holiday.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                检测阈值配置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {locations.map((location) => (
                <Card key={location.id} className="border-l-4 border-l-primary/50">
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-medium">{location.name}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label>置信度阈值: {location.confidenceThreshold}%</Label>
                        <Slider
                          value={[location.confidenceThreshold]}
                          onValueChange={([value]) => updateLocation(location.id, { confidenceThreshold: value })}
                          max={100}
                          min={50}
                          step={5}
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">AI检测置信度低于此值将被忽略</p>
                      </div>

                      <div className="space-y-3">
                        <Label>持续时间阈值: {location.durationThreshold}秒</Label>
                        <Slider
                          value={[location.durationThreshold]}
                          onValueChange={([value]) => updateLocation(location.id, { durationThreshold: value })}
                          max={60}
                          min={5}
                          step={5}
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">事件持续时间低于此值将被忽略</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-primary" />
                无障碍功能设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-secondary/50">
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-medium">音量控制</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>自动音量调节</Label>
                        <Switch
                          checked={globalSettings.autoAdjustVolume}
                          onCheckedChange={(checked) =>
                            setGlobalSettings((prev) => ({ ...prev, autoAdjustVolume: checked }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>夜间音量降低: {globalSettings.nightVolumeReduction}%</Label>
                        <Slider
                          value={[globalSettings.nightVolumeReduction]}
                          onValueChange={([value]) =>
                            setGlobalSettings((prev) => ({ ...prev, nightVolumeReduction: value }))
                          }
                          max={80}
                          min={20}
                          step={10}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-secondary/50">
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-medium">视觉辅助</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>闪烁灯光提醒</Label>
                        <Switch
                          checked={globalSettings.blinkingLightEnabled}
                          onCheckedChange={(checked) =>
                            setGlobalSettings((prev) => ({ ...prev, blinkingLightEnabled: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>老年友好模式</Label>
                        <Switch
                          checked={globalSettings.elderlyModeEnabled}
                          onCheckedChange={(checked) =>
                            setGlobalSettings((prev) => ({ ...prev, elderlyModeEnabled: checked }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-l-4 border-l-accent/50">
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-medium">多语言支持</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>启用多语言TTS</Label>
                      <Switch
                        checked={globalSettings.multiLanguageEnabled}
                        onCheckedChange={(checked) =>
                          setGlobalSettings((prev) => ({ ...prev, multiLanguageEnabled: checked }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>支持语言</Label>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="default">中文普通话</Badge>
                        <Badge variant="secondary">中文方言</Badge>
                        <Badge variant="outline">English</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Location Volume Settings */}
              <Card className="border-l-4 border-l-primary/50">
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-medium">各点位音量设置</h3>

                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                    >
                      <span className="font-medium">{location.name}</span>
                      <div className="flex items-center gap-4 w-48">
                        <Volume2 className="w-4 h-4 text-muted-foreground" />
                        <Slider
                          value={[location.volumeLevel]}
                          onValueChange={([value]) => updateLocation(location.id, { volumeLevel: value })}
                          max={100}
                          min={0}
                          step={10}
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground w-8">{location.volumeLevel}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={resetToDefaults}>
          <RotateCcw className="w-4 h-4 mr-2" />
          重置默认
        </Button>
        <Button onClick={saveConfiguration} className="neon-glow">
          <Save className="w-4 h-4 mr-2" />
          保存配置
        </Button>
      </div>
    </div>
  )
}
