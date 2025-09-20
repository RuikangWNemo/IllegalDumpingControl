"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type ClientType = "community" | "government"

export default function LoginPage() {
  const [username, setUsername] = useState("demo-admin")
  const [password, setPassword] = useState("123")
  const [showPassword, setShowPassword] = useState(false)
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClient) {
      setError("请先选择系统类型")
      return
    }

    setIsLoading(true)
    setError("")

    if (username === "demo-admin" && password === "123") {
      // Set authentication token in localStorage
      localStorage.setItem("ai_waste_auth", "authenticated")
      localStorage.setItem(
        "ai_waste_user",
        JSON.stringify({
          username: "demo-admin",
          role: selectedClient === "government" ? "government" : "community",
          clientType: selectedClient,
          loginTime: new Date().toISOString(),
        }),
      )

      // Redirect to dashboard
      router.push("/")
    } else {
      setError("用户名或密码错误")
    }

    setIsLoading(false)
  }

  if (!selectedClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center space-y-6 mb-8">
            <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-primary/20 neon-glow">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold neon-text">AI智能垃圾监管系统</h1>
              <p className="text-muted-foreground mt-2">请选择您的系统类型</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Government System */}
            <Card
              className="glass cursor-pointer hover:scale-105 transition-transform border-2 hover:border-purple-500/50"
              onClick={() => setSelectedClient("government")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-purple-500" />
                </div>
                <CardTitle className="text-purple-600">政府监管端</CardTitle>
                <CardDescription>政府部门宏观监督管理</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge variant="outline" className="w-full justify-start">
                  <Building2 className="w-3 h-3 mr-2" />
                  跨社区数据监督
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  <Shield className="w-3 h-3 mr-2" />
                  政策制定支持
                </Badge>
              </CardContent>
            </Card>

            {/* Community System */}
            <Card
              className="glass cursor-pointer hover:scale-105 transition-transform border-2 hover:border-blue-500/50"
              onClick={() => setSelectedClient("community")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="w-8 h-8 text-blue-500" />
                </div>
                <CardTitle className="text-blue-600">社区管理端</CardTitle>
                <CardDescription>物业管理方现场执行</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge variant="outline" className="w-full justify-start">
                  <Shield className="w-3 h-3 mr-2" />
                  实时监控管理
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  <Building2 className="w-3 h-3 mr-2" />
                  违规事件处理
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="glass border-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-primary/20 neon-glow">
              {selectedClient === "government" ? (
                <Shield className="w-8 h-8 text-purple-500" />
              ) : (
                <Building2 className="w-8 h-8 text-blue-500" />
              )}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold neon-text">
                {selectedClient === "government" ? "政府监管端" : "社区管理端"}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">请使用演示账户登录</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="demo-admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/50 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full neon-glow" disabled={isLoading}>
                {isLoading ? "登录中..." : "登录"}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  <strong>演示账户：</strong>
                  <br />
                  用户名: demo-admin
                  <br />
                  密码: 123
                </p>
              </div>

              <Button variant="outline" className="w-full bg-transparent" onClick={() => setSelectedClient(null)}>
                重新选择系统类型
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
