"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { reportsService } from "@/lib/reports"

interface ReportUserModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  reportedUserId: string
  reportedUserName: string
}

const REPORT_REASONS = [
  "Fraudulent activity",
  "Fake or counterfeit items",
  "Non-delivery after payment",
  "Item not as described",
  "Harassment or inappropriate behavior",
  "Spam or unwanted messages",
  "Other"
]

export default function ReportUserModal({
  isOpen,
  onOpenChange,
  reportedUserId,
  reportedUserName
}: ReportUserModalProps) {
  const { toast } = useToast()
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!reason) {
      toast({
        title: "Error",
        description: "Please select a reason for the report.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await reportsService.createReport({
        reportedId: reportedUserId,
        reason,
        description: description.trim() || undefined
      })

      toast({
        title: "Report submitted",
        description: "Your report has been submitted and will be reviewed.",
      })

      // Reset form and close modal
      setReason("")
      setDescription("")
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to submit report:', error)
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setReason("")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 font-semibold">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Report User
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Report {reportedUserName} for violating our community guidelines. 
            This will help us maintain a safe marketplace for everyone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-gray-900 font-medium">Reason for report *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="text-gray-900 bg-white border-gray-300">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {REPORT_REASONS.map((reportReason) => (
                  <SelectItem key={reportReason} value={reportReason} className="text-gray-900">
                    {reportReason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-900 font-medium">Additional details (optional)</Label>
            <Textarea
              id="description"
              placeholder="Please provide any additional context or details about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="text-gray-900 bg-white border-gray-300"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> False reports may result in your account being suspended. 
              Please only report genuine violations of our community guidelines.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting} className="text-gray-900 border-gray-300">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !reason}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 