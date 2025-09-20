"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Shield, MapPin } from "lucide-react"

interface ClientSelectorProps {
  onClientSelect: (clientType: "government" | "community") => void
}

export function ClientSelector({ onClientSelect }: ClientSelectorProps) {
  const [selectedClient, setSelectedClient] = useState<"government" | "community" | null>(null)

  const handleSelect = (clientType: "government" | "community") => {
    setSelectedClient(clientType)
    onClientSelect(clientType)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary/20 neon-glow">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold neon-text mb-2">AI智能垃圾监管系统</h1>
          <p className="text-lg text-muted-foreground">请选择您的系统类型</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Government Panel */}
          <Card
            className={`glass cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedClient === "government" ? "ring-2 ring-primary neon-glow" : ""
            }`}
            onClick={() => handleSelect("government")}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-20 h-20 rounded-xl bg-blue-500/20">
                  <Building2 className="w-10 h-10 text-blue-500" />
                </div>
              </div>
              <CardTitle className="text-2xl">政府监管端</CardTitle>
              <Badge variant="outline" className="w-fit mx-auto text-blue-500 border-blue-500/50">
                Government Panel
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>昆山市全域监管</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>宏观数据分析</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  <span>社区排名管理</span>
                </div>
              </div>
              <Button
                className="w-full mt-6"
                variant={selectedClient === "government" ? "default" : "outline"}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelect("government")
                }}
              >
                进入政府监管系统
              </Button>
            </CardContent>
          </Card>

          {/* Community Panel */}
          <Card
            className={`glass cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedClient === "community" ? "ring-2 ring-primary neon-glow" : ""
            }`}
            onClick={() => handleSelect("community")}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-20 h-20 rounded-xl bg-green-500/20">
                  <Users className="w-10 h-10 text-green-500" />
                </div>
              </div>
              <CardTitle className="text-2xl">社区管理端</CardTitle>
              <Badge variant="outline" className="w-fit mx-auto text-green-500 border-green-500/50">
                Community Panel
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-4 h-4 text-green-500" />
                  <span>社区精细化管理</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>实时违规处理</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span>本地区域监控</span>
                </div>
              </div>
              <Button
                className="w-full mt-6"
                variant={selectedClient === "community" ? "default" : "outline"}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelect("community")
                }}
              >
                进入社区管理系统
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">昆山市智能垃圾分类监管系统 - 基于AI视觉识别技术</p>
        </div>
      </div>
    </div>
  )
}
