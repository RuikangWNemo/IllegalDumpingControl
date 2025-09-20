"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  LineChart,
  Activity,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

const analysisData = {
  overview: {
    totalEvents: 1247,
    monthlyGrowth: -12.5,
    complianceRate: 87.2,
    avgResponseTime: 2.3,
    topViolationType: "illegal_dumping",
    peakHour: "14:00-15:00",
  },
  trends: [
    { month: "1月", violations: 156, compliance: 85.2, efficiency: 92.1 },
    { month: "2月", violations: 142, compliance: 87.8, efficiency: 94.3 },
    { month: "3月", violations: 138, compliance: 89.1, efficiency: 95.2 },
    { month: "4月", violations: 125, compliance: 91.4, efficiency: 96.8 },
    { month: "5月", violations: 118, compliance: 92.7, efficiency: 97.5 },
    { month: "6月", violations: 108, compliance: 94.2, efficiency: 98.1 },
  ],
  violationTypes: [
    { type: "非法倾倒", count: 456, percentage: 36.6, trend: "down" },
    { type: "分类错误", count: 342, percentage: 27.4, trend: "up" },
    { type: "垃圾溢出", count: 289, percentage: 23.2, trend: "stable" },
    { type: "设备损坏", count: 160, percentage: 12.8, trend: "down" },
  ],
  communityPerformance: [
    { name: "玉山镇中心社区", score: 95, violations: 12, improvement: 5.2 },
    { name: "花桥经济开发区", score: 92, violations: 18, improvement: 3.1 },
    { name: "巴城镇老街社区", score: 88, violations: 24, improvement: 0.8 },
    { name: "周市镇工业园区", score: 85, violations: 32, improvement: -1.2 },
    { name: "千灯镇古镇社区", score: 82, violations: 28, improvement: 2.1 },
  ],
}

export function DataAnalysisModule() {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-red-500" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-green-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">数据分析中心</h2>
          <p className="text-muted-foreground">深度分析垃圾分类监管数据，洞察管理趋势</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            筛选条件
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新数据
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总事件数</p>
                <p className="text-2xl font-bold">{analysisData.overview.totalEvents.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">
                    {Math.abs(analysisData.overview.monthlyGrowth)}% 月度下降
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/20">
                <BarChart3 className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">合规率</p>
                <p className="text-2xl font-bold">{analysisData.overview.complianceRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">持续改善</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-green-500/20">
                <PieChart className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">平均响应时间</p>
                <p className="text-2xl font-bold">{analysisData.overview.avgResponseTime}小时</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">效率提升</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-orange-500/20">
                <Calendar className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">高发时段</p>
                <p className="text-2xl font-bold">{analysisData.overview.peakHour}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Activity className="w-3 h-3 text-blue-500" />
                  <span className="text-xs text-blue-500">午后高峰</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/20">
                <LineChart className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">趋势分析</TabsTrigger>
          <TabsTrigger value="violations">违规分析</TabsTrigger>
          <TabsTrigger value="performance">社区表现</TabsTrigger>
          <TabsTrigger value="predictions">预测模型</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                月度趋势分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Trend Chart Placeholder */}
                <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">月度违规趋势图表</p>
                    <p className="text-sm text-muted-foreground">显示过去6个月的违规数量、合规率和处理效率变化</p>
                  </div>
                </div>

                {/* Trend Data Table */}
                <div className="space-y-3">
                  {analysisData.trends.map((trend, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium w-12">{trend.month}</div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">违规: </span>
                          <span className="font-medium">{trend.violations}起</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-sm font-medium">{trend.compliance}%</div>
                          <div className="text-xs text-muted-foreground">合规率</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{trend.efficiency}%</div>
                          <div className="text-xs text-muted-foreground">处理效率</div>
                        </div>
                        <div className="w-24">
                          <Progress value={trend.compliance} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="violations" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                违规类型分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart Placeholder */}
                <div className="h-64 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">违规类型分布图</p>
                  </div>
                </div>

                {/* Violation Types List */}
                <div className="space-y-4">
                  {analysisData.violationTypes.map((violation, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/30"
                    >
                      <div className="flex items-center gap-3">
                        {getTrendIcon(violation.trend)}
                        <div>
                          <div className="font-medium text-sm">{violation.type}</div>
                          <div className="text-xs text-muted-foreground">{violation.count}起事件</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{violation.percentage}%</div>
                        <div className="text-xs text-muted-foreground">占比</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                社区表现排行榜
              </CardTitle>
              <p className="text-sm text-muted-foreground">基于合规率、违规处理效率、居民满意度综合评分</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.communityPerformance.map((community, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{community.name}</div>
                        <div className="text-xs text-muted-foreground">违规事件: {community.violations}起</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{community.score}</div>
                        <div className="text-xs text-muted-foreground">综合评分</div>
                      </div>

                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>表现</span>
                          <span>{community.score}%</span>
                        </div>
                        <Progress value={community.score} className="h-2" />
                      </div>

                      <div className="text-center">
                        <div
                          className={`text-sm font-semibold ${
                            community.improvement > 0
                              ? "text-green-500"
                              : community.improvement < 0
                                ? "text-red-500"
                                : "text-gray-500"
                          }`}
                        >
                          {community.improvement > 0 ? "+" : ""}
                          {community.improvement}%
                        </div>
                        <div className="text-xs text-muted-foreground">月度变化</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                AI预测模型
              </CardTitle>
              <p className="text-sm text-muted-foreground">基于历史数据和机器学习算法预测未来趋势</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">下月违规预测</h4>
                    <div className="text-2xl font-bold text-blue-500 mb-2">95起</div>
                    <p className="text-sm text-muted-foreground">预计比本月减少13起，主要集中在工业园区</p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>预测准确率</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">合规率预测</h4>
                    <div className="text-2xl font-bold text-green-500 mb-2">89.5%</div>
                    <p className="text-sm text-muted-foreground">预计合规率将继续提升，达到年度目标</p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>置信度</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">高风险时段</h4>
                    <div className="text-2xl font-bold text-orange-500 mb-2">14-16点</div>
                    <p className="text-sm text-muted-foreground">午后时段违规概率最高，建议加强巡查</p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>风险等级</span>
                        <span>高</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">资源优化建议</h4>
                    <div className="text-2xl font-bold text-purple-500 mb-2">3个</div>
                    <p className="text-sm text-muted-foreground">建议在周市镇增加2个监控点，调整巡查路线</p>
                    <div className="mt-3">
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        查看详细建议
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
