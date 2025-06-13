import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminDashboardPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Check admin privileges
  const { data: adminUser, error } = await supabase.from("admin_users").select("*").eq("user_id", user.id).single()

  if (error || !adminUser) {
    redirect("/admin/login")
  }

  return <AdminDashboard user={user} admin={adminUser} />
}
