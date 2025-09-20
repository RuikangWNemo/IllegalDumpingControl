"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, TrendingUp, TrendingDown, Award, Star, MapPin } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const communityData = [
  {
    id: 1,
    name: "玉山镇中心社区",
    score: 95,
    rank: 1,
    trend: "up",
    compliance: 98,
    violations: 2,
    improvement: "+5%",
    population: 8500,
    cameras: 24,
  },
  {
    id: 2,
    name: "花桥经济开发区",
    score: 92,
    rank: 2,
    trend: "up",
    compliance: 94,
    violations: 8,
    improvement: "+3%",
    population: 12000,
    cameras: 36,
  },
  {
    id: 3,
    name: "巴城镇老街社区",
    score: 88,
    rank: 3,
    trend: "stable",
    compliance: 91,
    violations: 12,
    improvement: "0%",
    population: 6800,
    cameras: 18,
  },
  {
    id: 4,
    name: "周市镇工业园区",
    score: 85,
    rank: 4,
    trend: "down",
    compliance: 87,
    violations: 18,
    improvement: "-2%",
    population: 15000,
    cameras: 42,
  },
  {
    id: 5,
    name: "千灯镇古镇社区",
    score: 82,
    rank: 5,
    trend: "up",
    compliance: 85,
    violations: 22,
    improvement: "+1%",
    population: 5200,
    cameras: 15,
  },
]

export function CommunityRankings() {
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/50">
            <Trophy className="w-3 h-3 mr-1" />
            第一名
          </Badge>
        )
      case 2:
        return (
          <Badge className="bg-gray-500/20 text-gray-600 border-gray-500/50">
            <Award className="w-3 h-3 mr-1" />
            第二名
          </Badge>
        )
      case 3:
        return (
          <Badge className="bg-orange-500/20 text-orange-600 border-orange-500/50">
            <Star className="w-3 h-3 mr-1" />
            第三名
          </Badge>
        )
      default:
        return <Badge variant="outline">第{rank}名</Badge>
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400" />
    }
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          昆山市社区垃圾分类排行榜
        </CardTitle>
        <p className="text-sm text-muted-foreground">基于合规率、违规处理效率、AI识别准确度综合评分</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {communityData.map((community) => (
            <div
              key={community.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/30"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getRankBadge(community.rank)}
                  {getTrendIcon(community.trend)}
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {community.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>人口: {community.population.toLocaleString()}</span>
                    <span>摄像头: {community.cameras}个</span>
                    <span>违规: {community.violations}起</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{community.score}</div>
                  <div className="text-xs text-muted-foreground">综合评分</div>
                </div>

                <div className="w-32">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>合规率</span>
                    <span>{community.compliance}%</span>
                  </div>
                  <Progress value={community.compliance} className="h-2" />
                </div>

                <div className="text-center">
                  <div
                    className={`text-sm font-semibold ${
                      community.trend === "up"
                        ? "text-green-500"
                        : community.trend === "down"
                          ? "text-red-500"
                          : "text-gray-500"
                    }`}
                  >
                    {community.improvement}
                  </div>
                  <div className="text-xs text-muted-foreground">月度变化</div>
                </div>

                <Button variant="outline" size="sm">
                  详细报告
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/50">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">87.2%</div>
              <div className="text-sm text-muted-foreground">全市平均合规率</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">+2.3%</div>
              <div className="text-sm text-muted-foreground">月度提升</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500">62</div>
              <div className="text-sm text-muted-foreground">待处理违规</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">135</div>
              <div className="text-sm text-muted-foreground">监控摄像头</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
