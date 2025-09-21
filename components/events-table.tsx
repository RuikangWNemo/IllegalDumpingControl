"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertTriangle, CheckCircle, Clock, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface WasteEvent {
  id: string
  location_id: string
  location_name: string
  event_type: string
  confidence_score: number
  detected_at: string
  status: string
  coordinates: { lat: number; lng: number }
  metadata: any
}

interface EventsTableProps {
  events: WasteEvent[]
}

export function EventsTable({ events: initialEvents }: EventsTableProps) {
  const [events, setEvents] = useState(initialEvents)

  const getEventIcon = (eventType: string, status: string) => {
    if (status === "resolved") return CheckCircle
    if (eventType === "illegal_dumping") return AlertTriangle
    return Clock
  }

  const getEventColor = (eventType: string, status: string) => {
    if (status === "resolved") return "text-green-400"
    if (eventType === "illegal_dumping") return "text-red-400"
    return "text-yellow-400"
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "destructive" as const, text: "Active" },
      investigating: { variant: "secondary" as const, text: "Investigating" },
      resolved: { variant: "outline" as const, text: "Resolved" },
      false_positive: { variant: "outline" as const, text: "False Positive" },
    }
    return variants[status as keyof typeof variants] || variants.active
  }

  const getEventTypeText = (eventType: string) => {
    const types = {
      illegal_dumping: "Illegal Dumping",
      normal_disposal: "Normal Disposal",
      bin_full: "Bin Full",
      maintenance: "Maintenance",
    }
    return types[eventType as keyof typeof types] || eventType
  }

  const updateEventStatus = (eventId: string, newStatus: string) => {
    setEvents(events.map((event) => (event.id === eventId ? { ...event, status: newStatus } : event)))
    console.log("[v0] Updated event status:", eventId, "to", newStatus)
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Events List
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Detection Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => {
                const Icon = getEventIcon(event.event_type, event.status)
                const iconColor = getEventColor(event.event_type, event.status)
                const statusBadge = getStatusBadge(event.status)

                return (
                  <TableRow key={event.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div
                        className={`p-2 rounded-full bg-background/50 w-fit ${event.event_type === "illegal_dumping" && event.status === "active" ? "pulse-alert" : ""}`}
                      >
                        <Icon className={`w-4 h-4 ${iconColor}`} />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{getEventTypeText(event.event_type)}</TableCell>
                    <TableCell className="text-muted-foreground">{event.location_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${event.confidence_score * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {(event.confidence_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(event.detected_at), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge {...statusBadge}>{statusBadge.text}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Event
                          </DropdownMenuItem>
                          {event.status === "active" && (
                            <>
                              <DropdownMenuItem onClick={() => updateEventStatus(event.id, "investigating")}>
                                <Clock className="w-4 h-4 mr-2" />
                                Mark as Investigating
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateEventStatus(event.id, "resolved")}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Resolved
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateEventStatus(event.id, "false_positive")}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Mark as False Positive
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
