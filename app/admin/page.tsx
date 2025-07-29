"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Shield, 
  Users, 
  Flag, 
  Package, 
  BarChart3, 
  Search, 
  Eye, 
  Ban, 
  CheckCircle, 
  XCircle,
  Loader2,
  AlertTriangle,
  UserCheck,
  UserX,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Activity
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  role: string
  trustScore: number
  isBanned: boolean
  banReason?: string
  createdAt: string
  listings: any[]
}

interface Report {
  id: string
  reporterId: string
  reportedId: string
  reason: string
  description?: string
  status: string
  adminNotes?: string
  createdAt: string
  reporter: User
  reported: User
}

interface Listing {
  id: string
  title: string
  price: number
  status: string
  createdAt: string
  user: User
}

interface PlatformStats {
  totalUsers: number
  totalListings: number
  totalReports: number
  activeListings: number
  bannedUsers: number
  pendingReports: number
}

export default function AdminPage() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports' | 'listings'>('overview')
  
  // Data states
  const [users, setUsers] = useState<User[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalListings: 0,
    totalReports: 0,
    activeListings: 0,
    bannedUsers: 0,
    pendingReports: 0
  })

  // Search and filter states
  const [userSearch, setUserSearch] = useState("")
  const [reportStatusFilter, setReportStatusFilter] = useState("all")
  const [listingStatusFilter, setListingStatusFilter] = useState("all")

  // Modal states
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [banReason, setBanReason] = useState("")

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }

    if (currentUser.role !== "admin") {
      router.push("/")
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive",
      })
      return
    }

    fetchAdminData()
  }, [currentUser, router, toast])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [usersRes, reportsRes, listingsRes, statsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/reports'),
        fetch('/api/admin/listings'),
        fetch('/api/admin/stats')
      ])

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData.users || usersData)
      }

      if (reportsRes.ok) {
        const reportsData = await reportsRes.json()
        setReports(reportsData.reports || reportsData)
      }

      if (listingsRes.ok) {
        const listingsData = await listingsRes.json()
        setListings(listingsData.listings || listingsData)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

    } catch (error) {
      console.error('Failed to fetch admin data:', error)
      toast({
        title: "Error",
        description: "Failed to load admin data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReportAction = async (reportId: string, action: 'resolve' | 'dismiss', notes?: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action === 'resolve' ? 'resolved' : 'dismissed',
          adminNotes: notes || adminNotes,
          reviewedBy: currentUser?.id
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Report ${action === 'resolve' ? 'resolved' : 'dismissed'} successfully.`,
        })
        fetchAdminData() // Refresh data
        setSelectedReport(null)
        setAdminNotes("")
      } else {
        throw new Error('Failed to update report')
      }
    } catch (error) {
      console.error('Failed to update report:', error)
      toast({
        title: "Error",
        description: "Failed to update report status.",
        variant: "destructive",
      })
    }
  }

  const handleUserAction = async (userId: string, action: 'ban' | 'unban' | 'promote' | 'demote') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          banReason: action === 'ban' ? banReason : undefined
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `User ${action} successful.`,
        })
        fetchAdminData() // Refresh data
        setSelectedUser(null)
        setBanReason("")
      } else {
        throw new Error('Failed to update user')
      }
    } catch (error) {
      console.error('Failed to update user:', error)
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.firstName.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.lastName.toLowerCase().includes(userSearch.toLowerCase())
  )

  const filteredReports = reports.filter(report => 
    reportStatusFilter === "all" || report.status === reportStatusFilter
  )

  const filteredListings = listings.filter(listing => 
    listingStatusFilter === "all" || listing.status === listingStatusFilter
  )

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!currentUser || currentUser.role !== "admin") {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage users, reports, and platform statistics</p>
        </div>
        <div className="text-sm text-gray-500">Admin Access</div>
      </div>

      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Flag className="w-4 h-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="listings" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Listings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Listings</p>
                    <p className="text-2xl font-bold">{stats.activeListings}</p>
                  </div>
                  <Package className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                    <p className="text-2xl font-bold">{stats.pendingReports}</p>
                  </div>
                  <Flag className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Banned Users</p>
                    <p className="text-2xl font-bold">{stats.bannedUsers}</p>
                  </div>
                  <UserX className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Listings</p>
                    <p className="text-2xl font-bold">{stats.totalListings}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reports</p>
                    <p className="text-2xl font-bold">{stats.totalReports}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.slice(0, 5).map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Flag className="w-4 h-4 text-red-500" />
                      <div>
                        <p className="text-sm font-medium">
                          Report filed by {report.reporter.username}
                        </p>
                        <p className="text-xs text-gray-600">
                          Against {report.reported.username} - {report.reason}
                        </p>
                      </div>
                    </div>
                    <Badge variant={report.status === 'pending' ? 'default' : 'secondary'}>
                      {report.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trust Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username} • {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${
                            user.trustScore >= 80 ? 'text-green-600' :
                            user.trustScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {user.trustScore}/100
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.isBanned ? (
                            <Badge variant="destructive">Banned</Badge>
                          ) : (
                            <Badge variant="outline">Active</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Actions
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white border border-gray-200 shadow-xl">
                              <DialogHeader>
                                <DialogTitle>Manage User: {user.firstName} {user.lastName}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <Button
                                    variant={user.isBanned ? "outline" : "destructive"}
                                    onClick={() => handleUserAction(user.id, user.isBanned ? 'unban' : 'ban')}
                                  >
                                    {user.isBanned ? <UserCheck className="w-4 h-4 mr-1" /> : <Ban className="w-4 h-4 mr-1" />}
                                    {user.isBanned ? 'Unban' : 'Ban'}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleUserAction(user.id, user.role === 'admin' ? 'demote' : 'promote')}
                                  >
                                    {user.role === 'admin' ? 'Demote' : 'Promote to Admin'}
                                  </Button>
                                </div>
                                {!user.isBanned && (
                                  <div>
                                    <label className="text-sm font-medium">Ban Reason (if banning):</label>
                                    <Textarea
                                      value={banReason}
                                      onChange={(e) => setBanReason(e.target.value)}
                                      placeholder="Enter reason for ban..."
                                      className="mt-1"
                                    />
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="flex items-center justify-between">
            <Select value={reportStatusFilter} onValueChange={setReportStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={report.status === 'pending' ? 'default' : 'secondary'}>
                          {report.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-medium mb-2">
                        Report by {report.reporter.username} against {report.reported.username}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Reason:</strong> {report.reason}
                      </p>
                      {report.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Description:</strong> {report.description}
                        </p>
                      )}
                      {report.adminNotes && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Admin Notes:</strong> {report.adminNotes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReport(report)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border border-gray-200 shadow-xl">
                          <DialogHeader>
                            <DialogTitle>Review Report</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Report Details</h4>
                              <p><strong>Reporter:</strong> {report.reporter.username}</p>
                              <p><strong>Reported:</strong> {report.reported.username}</p>
                              <p><strong>Reason:</strong> {report.reason}</p>
                              {report.description && (
                                <p><strong>Description:</strong> {report.description}</p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium">Admin Notes:</label>
                              <Textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Add admin notes..."
                                className="mt-1"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleReportAction(report.id, 'resolve')}
                                className="flex-1"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Resolve
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleReportAction(report.id, 'dismiss')}
                                className="flex-1"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Listings Tab */}
        <TabsContent value="listings" className="space-y-6">
          <div className="flex items-center justify-between">
            <Select value={listingStatusFilter} onValueChange={setListingStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Listings</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Listing
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seller
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredListings.map((listing) => (
                      <tr key={listing.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {listing.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {listing.id}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {listing.user.firstName} {listing.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{listing.user.username}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {listing.price} Credits
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={
                            listing.status === 'active' ? 'default' :
                            listing.status === 'sold' ? 'secondary' : 'outline'
                          }>
                            {listing.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(listing.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 