import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/hardware/events/[id] - 获取特定事件详情
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { data: event, error } = await supabase.from("waste_events").select("*").eq("id", id).single()

    if (error || !event) {
      return NextResponse.json({ error: "事件不存在" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: event,
    })
  } catch (error) {
    console.error("API错误:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}

// PUT /api/hardware/events/[id] - 更新事件状态
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params
    const body = await request.json()

    const { status, metadata } = body

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (status) {
      updateData.status = status
      if (status === "resolved") {
        updateData.resolved_at = new Date().toISOString()
      }
    }

    if (metadata) {
      updateData.metadata = metadata
    }

    const { data: event, error } = await supabase.from("waste_events").update(updateData).eq("id", id).select().single()

    if (error) {
      return NextResponse.json({ error: "更新事件失败" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "事件更新成功",
      data: event,
    })
  } catch (error) {
    console.error("API错误:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}
