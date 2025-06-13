"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LogOut, Users, Building, Calendar, DollarSign, Mail, Phone, Settings } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { SpacesManagement } from "@/components/admin/spaces-management"

interface AdminDashboardProps {
  user: any
  admin: any
}

export function AdminDashboard({ user, admin }: AdminDashboardProps) {
  const [enquiries, setEnquiries] = useState([])
  const [stats, setStats] = useState({
    totalEnquiries: 0,
    pendingEnquiries: 0,
    totalSpaces: 6,
    monthlyRevenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch enquiries (you'll need to create this table)
      const { data: enquiriesData, error: enquiriesError } = await supabase
        .from("space_enquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)

      if (!enquiriesError && enquiriesData) {
        setEnquiries(enquiriesData)
        setStats((prev) => ({
          ...prev,
          totalEnquiries: enquiriesData.length,
          pendingEnquiries: enquiriesData.filter((e) => e.status === "pending").length,
        }))
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const mockEnquiries = [
    {
      id: 1,
      name: "John Smith",
      email: "john@company.com",
      phone: "+1 (555) 123-4567",
      space_name: "Grand Convention Center",
      event_type: "Corporate Event",
      event_date: "2024-02-15",
      attendees: 250,
      status: "pending",
      created_at: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@startup.com",
      phone: "+1 (555) 234-5678",
      space_name: "Modern Exhibition Hall",
      event_type: "Product Launch",
      event_date: "2024-02-20",
      attendees: 150,
      status: "confirmed",
      created_at: "2024-01-14T14:20:00Z",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael@techcorp.com",
      phone: "+1 (555) 345-6789",
      space_name: "Skyline Conference Center",
      event_type: "Conference",
      event_date: "2024-03-01",
      attendees: 300,
      status: "pending",
      created_at: "2024-01-13T09:15:00Z",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Welcome back, {admin.name || user.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {admin.role || "Admin"}
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enquiries</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockEnquiries.length}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Enquiries</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockEnquiries.filter((e) => e.status === "pending").length}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Spaces</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSpaces}</div>
              <p className="text-xs text-muted-foreground">All venues available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$24,500</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="enquiries" className="space-y-6">
          <TabsList>
            <TabsTrigger value="enquiries">Recent Enquiries</TabsTrigger>
            <TabsTrigger value="spaces">Manage Spaces</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="enquiries">
            <Card>
              <CardHeader>
                <CardTitle>Recent Enquiries</CardTitle>
                <CardDescription>Latest space booking enquiries from potential clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEnquiries.map((enquiry) => (
                    <div key={enquiry.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{enquiry.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {enquiry.space_name} - {enquiry.event_type}
                          </p>
                        </div>
                        <Badge
                          variant={enquiry.status === "pending" ? "destructive" : "default"}
                          className={enquiry.status === "confirmed" ? "bg-green-100 text-green-800" : ""}
                        >
                          {enquiry.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{enquiry.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{enquiry.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{new Date(enquiry.event_date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Users className="h-4 w-4" />
                          <span>{enquiry.attendees} attendees</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          {enquiry.status === "pending" && (
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              Respond
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="spaces">
            <SpacesManagement />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>System configuration and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">System Settings</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Configure system preferences and admin settings
                  </p>
                  <Button variant="outline">Configure Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
