"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Shield, MapPin } from "lucide-react"
import Image from "next/image"

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
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Image
                src="/images/dku-logo.png"
                alt="DKU Garbages Logo"
                width={200}
                height={200}
                className="drop-shadow-2xl"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold neon-text mb-2">DKU Smart Waste Management System</h1>
          <p className="text-lg text-muted-foreground">Please select your system type</p>
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
              <CardTitle className="text-2xl">Government Panel</CardTitle>
              <Badge variant="outline" className="w-fit mx-auto text-blue-500 border-blue-500/50">
                Government Panel
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>City-wide Monitoring</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>Macro Data Analysis</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  <span>Community Ranking Management</span>
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
                Enter Government System
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
              <CardTitle className="text-2xl">Community Panel</CardTitle>
              <Badge variant="outline" className="w-fit mx-auto text-green-500 border-green-500/50">
                Community Panel
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-4 h-4 text-green-500" />
                  <span>Fine-grained Community Management</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Real-time Violation Handling</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span>Local Area Monitoring</span>
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
                Enter Community System
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            DKU Smart Waste Classification Management System - Based on AI Vision Recognition Technology
          </p>
        </div>
      </div>
    </div>
  )
}
