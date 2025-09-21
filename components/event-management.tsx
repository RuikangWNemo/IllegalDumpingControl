import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EventsTable } from "@/components/events-table"
import { ArrowLeft, Search, Filter, Download } from "lucide-react"
import Link from "next/link"
import { EventStats } from "@/components/event-stats" // Declare the EventStats variable

export async function EventManagement() {
  const supabase = await createClient()

  // Fetch all events with pagination
  const { data: events, count } = await supabase
    .from("waste_events")
    .select("*", { count: "exact" })
    .order("detected_at", { ascending: false })
    .limit(50)

  // Fetch event statistics
  const { data: stats } = await supabase.from("waste_events").select("event_type, status")

  const eventStats = {
    total: count || 0,
    active: stats?.filter((s) => s.status === "active").length || 0,
    resolved: stats?.filter((s) => s.status === "resolved").length || 0,
    investigating: stats?.filter((s) => s.status === "investigating").length || 0,
    illegalDumping: stats?.filter((s) => s.event_type === "illegal_dumping").length || 0,
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
                <h1 className="text-2xl font-bold">Event Management</h1>
                <p className="text-sm text-muted-foreground">View and manage all detected events</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Badge variant="outline" className="text-primary border-primary/50">
                {eventStats.total} Total Events
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Statistics Cards */}
          <EventStats stats={eventStats} />

          {/* Filters and Search */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters and Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search events, locations or descriptions..." className="pl-10" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="illegal_dumping">Illegal Dumping</SelectItem>
                      <SelectItem value="normal_disposal">Normal Disposal</SelectItem>
                      <SelectItem value="bin_full">Bin Full</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="false_positive">False Positive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="7d">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1d">Today</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="90d">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Events Table */}
          <EventsTable events={events || []} />
        </div>
      </div>
    </div>
  )
}
