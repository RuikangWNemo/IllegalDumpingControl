"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("ai_waste_auth")
    localStorage.removeItem("ai_waste_user")
    router.push("/login")
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      <LogOut className="w-4 h-4 mr-2" />
      退出登录
    </Button>
  )
}
