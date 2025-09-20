"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Shield, Users, Camera } from "lucide-react"

export type ClientType = "community" | "government"

interface ClientSelectorProps {
  onClientSelect: (clientType: ClientType) => void
  currentClient?: ClientType
}

export function ClientSelector({ onClientSelect, currentClient }: ClientSelectorProps) {
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(currentClient || null)

  const handleClientSelect = (clientType: ClientType) => {
    setSelectedClient(clientType)
    onClientSelect(clientType)
  }

  if (selectedClient) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Card className="glass">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              {selectedClient === "community" ? (
                <>
                  <Building2 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">社区管理端</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">政府监管端</span>
                </>
              )}
              <Button size="sm" variant="ghost" onClick={() => setSelectedClient(null)} className="h-6 px-2 text-xs">
                切换
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="space-y-6 max-w-2xl mx-auto p-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">选择客户端类型</h2>
          <p className="text-muted-foreground">请选择您的身份以访问相应的监管界面</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Community Client */}
          <Card
            className="glass cursor-pointer hover:scale-105 transition-transform border-2 hover:border-blue-500/50"
            onClick={() => handleClientSelect("community")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-blue-500" />
              </div>
              <CardTitle className="text-blue-600">社区管理端</CardTitle>
              <p className="text-sm text-muted-foreground">物业管理方使用</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-start">
                  <Camera className="w-3 h-3 mr-2" />
                  实时视频监控
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  <Users className="w-3 h-3 mr-2" />
                  违规事件处理
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  <Shield className="w-3 h-3 mr-2" />
                  本地社区管理
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">适用于：物业公司、社区管理员、现场执行人员</div>
            </CardContent>
          </Card>

          {/* Government Client */}
          <Card
            className="glass cursor-pointer hover:scale-105 transition-transform border-2 hover:border-purple-500/50"
            onClick={() => handleClientSelect("government")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
              <CardTitle className="text-purple-600">政府监管端</CardTitle>
              <p className="text-sm text-muted-foreground">政府部门使用</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-start">
                  <Building2 className="w-3 h-3 mr-2" />
                  跨社区监督
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  <Users className="w-3 h-3 mr-2" />
                  宏观数据分析
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  <Shield className="w-3 h-3 mr-2" />
                  政策制定支持
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">适用于：城管部门、环保局、市政府相关部门</div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-xs text-muted-foreground">演示系统 - 可随时切换客户端类型体验不同功能</div>
      </div>
    </div>
  )
}
