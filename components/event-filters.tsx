"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Filter, Search, X } from "lucide-react"

export function EventFilters() {
  const [filters, setFilters] = useState({
    search: "",
    eventType: "all",
    status: "all",
    location: "all",
    dateRange: null,
  })

  const clearFilters = () => {
    setFilters({
      search: "",
      eventType: "all",
      status: "all",
      location: "all",
      dateRange: null,
    })
  }

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            筛选器
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            清除筛选
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索事件、位置或描述..."
            className="pl-10"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select value={filters.eventType} onValueChange={(value) => setFilters({ ...filters, eventType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="事件类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有类型</SelectItem>
              <SelectItem value="illegal_dumping">非法倾倒</SelectItem>
              <SelectItem value="normal_disposal">正常投放</SelectItem>
              <SelectItem value="bin_full">垃圾桶满</SelectItem>
              <SelectItem value="maintenance">设备维护</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有状态</SelectItem>
              <SelectItem value="active">活跃</SelectItem>
              <SelectItem value="investigating">调查中</SelectItem>
              <SelectItem value="resolved">已解决</SelectItem>
              <SelectItem value="false_positive">误报</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
            <SelectTrigger>
              <SelectValue placeholder="监控位置" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有位置</SelectItem>
              <SelectItem value="loc_001">社区垃圾站A</SelectItem>
              <SelectItem value="loc_002">社区垃圾站B</SelectItem>
              <SelectItem value="loc_003">社区垃圾站C</SelectItem>
              <SelectItem value="loc_004">社区垃圾站D</SelectItem>
            </SelectContent>
          </Select>

          <DatePickerWithRange />
        </div>
      </CardContent>
    </Card>
  )
}
