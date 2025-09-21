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
    { month: "Jan", violations: 156, compliance: 85.2, efficiency: 92.1 },
    { month: "Feb", violations: 142, compliance: 87.8, efficiency: 94.3 },
    { month: "Mar", violations: 138, compliance: 89.1, efficiency: 95.2 },
    { month: "Apr", violations: 125, compliance: 91.4, efficiency: 96.8 },
    { month: "May", violations: 118, compliance: 92.7, efficiency: 97.5 },
    { month: "Jun", violations: 108, compliance: 94.2, efficiency: 98.1 },
  ],
  violationTypes: [
    { type: "Illegal Dumping", count: 456, percentage: 36.6, trend: "down" },
    { type: "Sorting Error", count: 342, percentage: 27.4, trend: "up" },
    { type: "Bin Overflow", count: 289, percentage: 23.2, trend: "stable" },
    { type: "Equipment Damage", count: 160, percentage: 12.8, trend: "down" },
  ],
  communityPerformance: [
    { name: "Yushan Town Central Community", score: 95, violations: 12, improvement: 5.2 },
    { name: "Huaqiao Economic Development Zone", score: 92, violations: 18, improvement: 3.1 },
    { name: "Bacheng Town Old Street Community", score: 88, violations: 24, improvement: 0.8 },
    { name: "Zhoushi Town Industrial Park", score: 85, violations: 32, improvement: -1.2 },
    { name: "Qiandeng Town Ancient Town Community", score: 82, violations: 28, improvement: 2.1 },
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
          <h2 className="text-2xl font-bold">Data Analysis Center</h2>
          <p className="text-muted-foreground">
            Deep analysis of waste management data, insights into management trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter Options
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{analysisData.overview.totalEvents.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">
                    {Math.abs(analysisData.overview.monthlyGrowth)}% Monthly Decrease
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
                <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold">{analysisData.overview.complianceRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">Continuous Improvement</span>
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
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">
                  {analysisData.overview.avgResponseTime}
                  <span className="text-lg">hrs</span>
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">Efficiency Improved</span>
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
                <p className="text-sm font-medium text-muted-foreground">Peak Hours</p>
                <p className="text-2xl font-bold">{analysisData.overview.peakHour}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Activity className="w-3 h-3 text-blue-500" />
                  <span className="text-xs text-blue-500">Afternoon Peak</span>
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
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="violations">Violation Analysis</TabsTrigger>
          <TabsTrigger value="performance">Community Performance</TabsTrigger>
          <TabsTrigger value="predictions">Prediction Models</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Monthly Trend Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Trend Chart Placeholder */}
                <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Monthly Violation Trend Chart</p>
                    <p className="text-sm text-muted-foreground">
                      Shows changes in violations, compliance rate and processing efficiency over the past 6 months
                    </p>
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
                          <span className="text-muted-foreground">Violations: </span>
                          <span className="font-medium">{trend.violations} cases</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-sm font-medium">{trend.compliance}%</div>
                          <div className="text-xs text-muted-foreground">Compliance</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{trend.efficiency}%</div>
                          <div className="text-xs text-muted-foreground">Efficiency</div>
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
                Violation Type Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart Placeholder */}
                <div className="h-64 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Violation Type Distribution</p>
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
                          <div className="text-xs text-muted-foreground">{violation.count} events</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{violation.percentage}%</div>
                        <div className="text-xs text-muted-foreground">Share</div>
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
                Community Performance Rankings
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Comprehensive scoring based on compliance rate, violation handling efficiency, and resident satisfaction
              </p>
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
                        <div className="text-xs text-muted-foreground">Violations: {community.violations} cases</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{community.score}</div>
                        <div className="text-xs text-muted-foreground">Overall Score</div>
                      </div>

                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Performance</span>
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
                        <div className="text-xs text-muted-foreground">Monthly Change</div>
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
                AI Prediction Models
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Predict future trends based on historical data and machine learning algorithms
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Next Month Violation Prediction</h4>
                    <div className="text-2xl font-bold text-blue-500 mb-2">95 cases</div>
                    <p className="text-sm text-muted-foreground">
                      Expected to decrease by 13 cases from this month, mainly concentrated in industrial parks
                    </p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Prediction Accuracy</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Compliance Rate Prediction</h4>
                    <div className="text-2xl font-bold text-green-500 mb-2">89.5%</div>
                    <p className="text-sm text-muted-foreground">
                      Expected compliance rate will continue to improve, reaching annual targets
                    </p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Confidence Level</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">High Risk Time Periods</h4>
                    <div className="text-2xl font-bold text-orange-500 mb-2">14-16:00</div>
                    <p className="text-sm text-muted-foreground">
                      Afternoon periods have the highest violation probability, recommend increased patrols
                    </p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Risk Level</span>
                        <span>High</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Resource Optimization Suggestions</h4>
                    <div className="text-2xl font-bold text-purple-500 mb-2">3 items</div>
                    <p className="text-sm text-muted-foreground">
                      Recommend adding 2 monitoring points in Zhoushi Town, adjust patrol routes
                    </p>
                    <div className="mt-3">
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        View Detailed Suggestions
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
