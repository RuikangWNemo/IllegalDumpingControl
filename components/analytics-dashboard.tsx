import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BarChart3, TrendingUp, Calendar, Download } from "lucide-react"
import { EventsChart } from "@/components/events-chart"
import { HeatMap } from "@/components/heat-map"
import { TrendAnalysis } from "@/components/trend-analysis"
import { LocationAnalytics } from "@/components/location-analytics"
import Link from "next/link"

export async function AnalyticsDashboard() {
  const supabase = await createClient()

  // Fetch analytics data
  const { data: events } = await supabase
    .from("waste_events")
    .select("*")
    .order("detected_at", { ascending: false })
    .limit(1000)

  const { data: locations } = await supabase.from("monitoring_locations").select("*")

  // Process data for analytics
  const processedData = {
    events: events || [],
    locations: locations || [],
    totalEvents: events?.length || 0,
    illegalDumpingEvents: events?.filter((e) => e.event_type === "illegal_dumping").length || 0,
    resolvedEvents: events?.filter((e) => e.status === "resolved").length || 0,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/?panel=government">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Analytics Reports</h1>
                <p className="text-sm text-muted-foreground">Deep analysis and heat map visualization</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Badge variant="outline" className="text-primary border-primary/50">
                <Calendar className="w-3 h-3 mr-1" />
                Last 30 Days
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                    <p className="text-3xl font-bold">{processedData.totalEvents}</p>
                    <div className="flex items-center gap-1 text-xs mt-1">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-green-400">+12.5%</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Illegal Dumping</p>
                    <p className="text-3xl font-bold">{processedData.illegalDumpingEvents}</p>
                    <div className="flex items-center gap-1 text-xs mt-1">
                      <TrendingUp className="w-3 h-3 text-red-400" />
                      <span className="text-red-400">-8.2%</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-red-400/10">
                    <BarChart3 className="w-6 h-6 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Resolution Rate</p>
                    <p className="text-3xl font-bold">
                      {processedData.totalEvents > 0
                        ? Math.round((processedData.resolvedEvents / processedData.totalEvents) * 100)
                        : 0}
                      %
                    </p>
                    <div className="flex items-center gap-1 text-xs mt-1">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-green-400">+15.3%</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-green-400/10">
                    <BarChart3 className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                    <p className="text-3xl font-bold">
                      2.3<span className="text-lg">min</span>
                    </p>
                    <div className="flex items-center gap-1 text-xs mt-1">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-green-400">-22%</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-400/10">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EventsChart events={processedData.events} />
            <TrendAnalysis events={processedData.events} />
          </div>

          {/* Heat Map and Location Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HeatMap events={processedData.events} locations={processedData.locations} />
            </div>
            <div className="lg:col-span-1">
              <LocationAnalytics events={processedData.events} locations={processedData.locations} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
