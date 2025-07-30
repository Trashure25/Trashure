"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PageTransition } from "@/components/page-transition"
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'expired'>('verifying')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || !email) {
        setStatus('error')
        setMessage('Invalid verification link. Please check your email for the correct link.')
        setLoading(false)
        return
      }

      try {
        const result = await auth.verifyEmail({ token, email })
        
        if (result.success) {
          setStatus('success')
          setMessage('Your email has been verified successfully! You can now use all features of Trashure.')
        } else {
          setStatus('error')
          setMessage(result.error || 'Verification failed. Please try again.')
        }
      } catch (error) {
        setStatus('error')
        setMessage('An error occurred during verification. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    verifyEmail()
  }, [token, email])

  const handleResendVerification = async () => {
    if (!email) return
    
    setLoading(true)
    try {
      const result = await auth.sendVerificationEmail(email)
      if (result.success) {
        setMessage('A new verification email has been sent. Please check your inbox.')
      } else {
        setMessage(result.error || 'Failed to send verification email.')
      }
    } catch (error) {
      setMessage('An error occurred while sending the verification email.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500" />
      case 'expired':
        return <XCircle className="w-16 h-16 text-orange-500" />
      default:
        return <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      case 'expired':
        return 'text-orange-600'
      default:
        return 'text-blue-600'
    }
  }

  return (
    <PageTransition>
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <CardTitle className={`text-2xl ${getStatusColor()}`}>
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
              {status === 'expired' && 'Link Expired'}
              {status === 'verifying' && 'Verifying Email...'}
            </CardTitle>
            <CardDescription>
              {status === 'success' && 'Your account is now fully activated'}
              {status === 'error' && 'We couldn\'t verify your email address'}
              {status === 'expired' && 'This verification link has expired'}
              {status === 'verifying' && 'Please wait while we verify your email'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <p className="text-center text-sm text-gray-600 mb-4">
              {message}
            </p>
            
            {status === 'error' && email && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Didn't receive the email? Check your spam folder or request a new verification link.
                </p>
                <Button 
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col items-stretch">
            {status === 'success' && (
              <Button onClick={() => router.push('/')} className="w-full">
                Continue to Trashure
              </Button>
            )}
            
            {(status === 'error' || status === 'expired') && (
              <Button variant="outline" onClick={() => router.push('/login')} className="w-full">
                Back to Login
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
} 