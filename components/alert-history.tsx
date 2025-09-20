"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Volume2, Lightbulb, Smartphone, Mail, Bell, CheckCircle, XCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"

interface Alert {
  id: string
  alert_type: string
  message: string
  sent_at: string
  status: string
  waste_events?: {
    location_name: string
    event_type: string
    confidence_score: number
  }
}

interface AlertHistoryProps {
  alerts: Alert[]
}

export function AlertHistory({ alerts }: AlertHistoryProps) {
  const getAlertIcon = (alertType: string) => {
    const icons = {
      voice_warning: Volume2,
      light_flash: Lightbulb,
      sms: Smartphone,
      email: Mail,
      dashboard: Bell,
    }
    return icons[alertType as keyof typeof icons] || Bell
  }

  const getAlertTypeText = (alertType: string) => {
    const types = {
      voice_warning: "语音警告",
      light_flash: "闪光警示",
      sms: "短信通知",
      email: "邮件通知",
      dashboard: "仪表板通知",
    }
    return types[alertType as keyof typeof types] || alertType
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: { variant: "default" as const, text: "已发送", icon: CheckCircle },
      pending: { variant: "secondary" as const, text: "待发送", icon: Bell },
      failed: { variant: "destructive" as const, text: "发送失败", icon: XCircle },
    }
    return variants[status as keyof typeof variants] || variants.sent
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          警报历史记录
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>类型</TableHead>
                <TableHead>位置</TableHead>
                <TableHead>消息</TableHead>
                <TableHead>时间</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => {
                const Icon = getAlertIcon(alert.alert_type)
                const statusBadge = getStatusBadge(alert.status)
                const StatusIcon = statusBadge.icon

                return (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div className="p-2 rounded-full bg-primary/10 w-fit">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{getAlertTypeText(alert.alert_type)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {alert.waste_events?.location_name || "系统"}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{alert.message}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.sent_at), {
                        addSuffix: true,
                        locale: zhCN,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge {...statusBadge} className="flex items-center gap-1 w-fit">
                        <StatusIcon className="w-3 h-3" />
                        {statusBadge.text}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
