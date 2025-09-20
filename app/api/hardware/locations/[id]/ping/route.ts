import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// POST /api/hardware/locations/[id]/ping - 设备心跳检测
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params
    const body = await request.json()

    const { camera_status = "active", settings, metadata } = body

    const updateData: any = {
      last_ping: new Date().toISOString(),
      camera_status,
      updated_at: new Date().toISOString(),
    }

    if (settings) {
      updateData.settings = settings
    }

    const { data: location, error } = await supabase
      .from("monitoring_locations")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error || !location) {
      return NextResponse.json({ error: "监控点不存在或更新失败" }, { status: 404 })
    }

    // 检查是否有待处理的事件需要设备处理
    const { data: pendingEvents } = await supabase
      .from("waste_events")
      .select("id, event_type, status")
      .eq("location_id", id)
      .eq("status", "pending")
      .limit(10)

    return NextResponse.json({
      success: true,
      message: "心跳更新成功",
      data: {
        location,
        pending_events: pendingEvents || [],
        server_time: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("API错误:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}
