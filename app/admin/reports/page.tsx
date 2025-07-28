"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { adminService } from "@/lib/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  UserX, 
  Loader2,
  ArrowLeft,
  Clock,
  FileText
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { AdminReport } from "@/lib/admin"

export default function AdminReportsPage() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [reports, setReports] = useState<AdminReport[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewAction, setReviewAction] = useState<'approve' | 'dismiss'>('approve')
  const [adminNotes, setAdminNotes] = useState('')
  const [banUser, setBanUser] = useState(false)
  const [banReason, setBanReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const checkAdminAndLoadReports = async () => {
      try {
        setLoading(true)
        
        // Check if user is admin
        const adminStatus = await adminService.checkAdminStatus()
        setIsAdmin(adminStatus)
        
        if (!adminStatus) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin dashboard.",
            variant: "destructive",
          })
          router.push("/")
          return
        }

        // Load reports
        await loadReports()
      } catch (error) {
        console.error('Error loading admin reports:', error)
        toast({
          title: "Error",
          description: "Failed to load reports.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      checkAdminAndLoadReports()
    }
  }, [currentUser, router, toast])

  const loadReports = async (page: number = 1) => {
    try {
      const data = await adminService.getAllReports(page, 20)
      setReports(data.reports)
      setTotalPages(data.pagination.totalPages)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error loading reports:', error)
      toast({
        title: "Error",
        description: "Failed to load reports.",
        variant: "destructive",
      })
    }
  }

  const handleReviewReport = (report: AdminReport) => {
    setSelectedReport(report)
    setReviewAction('approve')
    setAdminNotes('')
    setBanUser(false)
    setBanReason('')
    setIsReviewModalOpen(true)
  }

  const submitReview = async () => {
    if (!selectedReport) return

    setIsSubmitting(true)
    try {
      await adminService.reviewReport({
        reportId: selectedReport.id,
        action: reviewAction,
        adminNotes: adminNotes.trim() || undefined,
        banUser: banUser,
        banReason: banUser ? banReason : undefined
      })

      toast({
        title: "Report Reviewed",
        description: `Report has been ${reviewAction === 'approve' ? 'approved' : 'dismissed'}.`,
      })

      // Reload reports
      await loadReports(currentPage)
      setIsReviewModalOpen(false)
    } catch (error) {
      console.error('Error reviewing report:', error)
      toast({
        title: "Error",
        description: "Failed to review report.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Pending</Badge>
      case 'reviewed':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Reviewed</Badge>
      case 'resolved':
        return <Badge variant="outline" className="text-green-600 border-green-600">Resolved</Badge>
      case 'dismissed':
        return <Badge variant="outline" className="text-gray-600 border-gray-600">Dismissed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin dashboard.</p>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-600" />
              Report Management
            </h1>
            <p className="text-gray-600 mt-1">Review and take action on user reports</p>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reports found</h3>
              <p className="text-gray-600">All reports have been reviewed.</p>
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        <span className="font-semibold">{report.reason}</span>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Reporter</h4>
                        <p className="text-sm text-gray-600">
                          {report.reporter.firstName} {report.reporter.lastName} (@{report.reporter.username})
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Reported User</h4>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-600">
                            {report.reported.firstName} {report.reported.lastName} (@{report.reported.username})
                          </p>
                          <Badge variant="outline" className="text-xs">
                            Trust: {report.reported.trustScore}
                          </Badge>
                          {report.reported.isBanned && (
                            <Badge variant="destructive" className="text-xs">Banned</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {report.description && (
                      <div>
                        <h4 className="font-medium text-gray-900">Description</h4>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                      {report.reviewedBy && (
                        <div className="flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          Reviewed by {report.reviewer?.firstName} {report.reviewer?.lastName}
                        </div>
                      )}
                    </div>
                  </div>

                  {report.status === 'pending' && (
                    <Button onClick={() => handleReviewReport(report)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => loadReports(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => loadReports(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Review Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Report</DialogTitle>
            <DialogDescription>
              Take action on this report and optionally ban the reported user.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Action</Label>
              <Select value={reviewAction} onValueChange={(value: 'approve' | 'dismiss') => setReviewAction(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">Approve Report</SelectItem>
                  <SelectItem value="dismiss">Dismiss Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Admin Notes</Label>
              <Textarea
                placeholder="Add notes about your decision..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>

            {reviewAction === 'approve' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="banUser"
                    checked={banUser}
                    onChange={(e) => setBanUser(e.target.checked)}
                  />
                  <Label htmlFor="banUser">Ban reported user</Label>
                </div>
                
                {banUser && (
                  <div className="space-y-2">
                    <Label>Ban Reason</Label>
                    <Textarea
                      placeholder="Reason for banning the user..."
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      rows={2}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={submitReview} disabled={isSubmitting || (banUser && !banReason.trim())}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                reviewAction === 'approve' ? 'Approve Report' : 'Dismiss Report'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 