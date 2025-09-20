"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Target, AlertTriangle, Download, FileText } from "lucide-react"

interface AIMetrics {
  precision: number
  recall: number
  falsePositiveRate: number
  totalEvents: number
  truePositives: number
  falsePositives: number
  falseNegatives: number
  trueNegatives: number
}

export function AIMetricsDashboard() {
  const [metrics, setMetrics] = useState<AIMetrics>({
    precision: 0.87,
    recall: 0.92,
    falsePositiveRate: 0.13,
    totalEvents: 156,
    truePositives: 89,
    falsePositives: 13,
    falseNegatives: 7,
    trueNegatives: 47,
  })

  // Simulate real-time metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        precision: Math.max(0.75, Math.min(0.95, prev.precision + (Math.random() - 0.5) * 0.02)),
        recall: Math.max(0.8, Math.min(0.98, prev.recall + (Math.random() - 0.5) * 0.02)),
        falsePositiveRate: Math.max(0.05, Math.min(0.2, prev.falsePositiveRate + (Math.random() - 0.5) * 0.02)),
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const confusionMatrix = [
    [metrics.truePositives, metrics.falseNegatives],
    [metrics.falsePositives, metrics.trueNegatives],
  ]

  const exportReport = (format: "pdf" | "excel") => {
    // Simulate export functionality
    console.log(`Exporting ${format} report...`)
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">精确率 (Precision)</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-2xl font-bold">{(metrics.precision * 100).toFixed(1)}%</p>
                  <Badge variant="outline" className="text-green-400 border-green-400/50">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2.3%
                  </Badge>
                </div>
                <Progress value={metrics.precision * 100} className="mt-3" />
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">召回率 (Recall)</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-2xl font-bold">{(metrics.recall * 100).toFixed(1)}%</p>
                  <Badge variant="outline" className="text-green-400 border-green-400/50">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +1.8%
                  </Badge>
                </div>
                <Progress value={metrics.recall * 100} className="mt-3" />
              </div>
              <div className="p-3 rounded-lg bg-blue-400/10">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">误报率 (FPR)</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-2xl font-bold">{(metrics.falsePositiveRate * 100).toFixed(1)}%</p>
                  <Badge variant="outline" className="text-red-400 border-red-400/50">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -0.5%
                  </Badge>
                </div>
                <Progress value={metrics.falsePositiveRate * 100} className="mt-3" />
              </div>
              <div className="p-3 rounded-lg bg-red-400/10">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confusion Matrix */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              混淆矩阵 (Confusion Matrix)
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => exportReport("pdf")}>
                <FileText className="w-4 h-4 mr-2" />
                导出PDF
              </Button>
              <Button size="sm" variant="outline" onClick={() => exportReport("excel")}>
                <Download className="w-4 h-4 mr-2" />
                导出Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div></div>
              <div className="font-medium text-sm text-muted-foreground">预测为正例</div>
              <div className="font-medium text-sm text-muted-foreground">预测为负例</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium text-sm text-muted-foreground text-right">实际为正例</div>
              <Card className="bg-green-400/10 border-green-400/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{confusionMatrix[0][0]}</div>
                  <div className="text-xs text-muted-foreground">真正例 (TP)</div>
                </CardContent>
              </Card>
              <Card className="bg-red-400/10 border-red-400/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">{confusionMatrix[0][1]}</div>
                  <div className="text-xs text-muted-foreground">假负例 (FN)</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium text-sm text-muted-foreground text-right">实际为负例</div>
              <Card className="bg-yellow-400/10 border-yellow-400/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{confusionMatrix[1][0]}</div>
                  <div className="text-xs text-muted-foreground">假正例 (FP)</div>
                </CardContent>
              </Card>
              <Card className="bg-blue-400/10 border-blue-400/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{confusionMatrix[1][1]}</div>
                  <div className="text-xs text-muted-foreground">真负例 (TN)</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">F1分数</p>
                <p className="font-medium">
                  {((2 * metrics.precision * metrics.recall) / (metrics.precision + metrics.recall)).toFixed(3)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">准确率</p>
                <p className="font-medium">
                  {(((metrics.truePositives + metrics.trueNegatives) / metrics.totalEvents) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">总事件数</p>
                <p className="font-medium">{metrics.totalEvents}</p>
              </div>
              <div>
                <p className="text-muted-foreground">最后更新</p>
                <p className="font-medium">{new Date().toLocaleTimeString("zh-CN", { hour12: false })}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
