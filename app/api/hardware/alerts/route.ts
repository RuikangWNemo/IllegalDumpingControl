import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/hardware/alerts - 获取警报列表
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const location_id = searchParams.get("location_id")
    const status = searchParams.get("status") || "active"
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    let query = supabase
      .from("alerts")
      .select(`
        *,
        waste_events (
          location_id,
          location_name,
          event_type,
          coordinates
        )
      `)
      .eq("status", status)
      .order("sent_at", { ascending: false })
      .limit(limit)

    if (location_id) {
      query = query.eq("waste_events.location_id", location_id)
    }

    const { data: alerts, error } = await query

    if (error) {
      return NextResponse.json({ error: "查询警报失败" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: alerts,
      count: alerts.length,
    })
  } catch (error) {
    console.error("API错误:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}

// PUT /api/hardware/alerts/[id]/acknowledge - 确认警报
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { data: alert, error } = await supabase
      .from("alerts")
      .update({
        status: "acknowledged",
        metadata: {
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: "hardware_device",
        },
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "确认警报失败" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "警报已确认",
      data: alert,
    })
  } catch (error) {
    console.error("API错误:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}
