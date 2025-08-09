'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess?: () => void
  course: {
    _id: string
    title: string
    price: number
  }
}

type PaymentStatus = 'idle' | 'loading' | 'qr_ready' | 'checking' | 'success' | 'failed'

export function PaymentModal({ isOpen, onClose, onPaymentSuccess, course }: PaymentModalProps) {
  const [status, setStatus] = useState<PaymentStatus>('idle')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(null)
  const [isTestMode, setIsTestMode] = useState(false)
  const [payUrl, setPayUrl] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  // Auto-open provider page on desktop once the pay URL is ready (keep original tab for polling)
  useEffect(() => {
    if (
      isOpen &&
      status === 'qr_ready' &&
      payUrl &&
      !isTestMode &&
      typeof window !== 'undefined' &&
      !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    ) {
      try {
        window.open(payUrl, '_blank', 'noopener')
      } catch {}
    }
  }, [isOpen, status, payUrl, isTestMode])

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStatus('idle')
      setOrderId(null)
      setIsTestMode(false)
      setPayUrl(null)
      if (checkInterval) {
        clearInterval(checkInterval)
        setCheckInterval(null)
      }
    }
  }, [isOpen, checkInterval])

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: 'Нэвтрэх шаардлагатай',
        description: 'Төлбөр төлөхийн тулд эхлээд нэвтэрнэ үү',
        variant: 'destructive'
      })
      onClose()
      router.push('/auth/login')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/payments/byl/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course._id
        })
      })

      const data = await response.json()

      if (response.ok) {
        setOrderId(data.orderId)
        setPayUrl(data.bylUrl || data.qpayUrl || null)
        setStatus('qr_ready')
        
        // Check if this is test mode (QR code contains test data or placeholder)
        if (data.qrImage && (
          data.qrImage.includes('/placeholder.svg') || 
          data.qrImage.includes('placeholder') ||
          data.qrImage.includes('Test QR code') ||
          data.qrImage.includes('data:image/svg+xml') ||
          data.qrImage.includes('api.qrserver.com') ||
          data.fallback
        )) {
          setIsTestMode(true)
          
          if (data.fallback) {
            toast({
              title: 'Бил API холбогдох боломжгүй',
              description: 'Тест горимд ажиллаж байна',
              variant: 'default'
            })
          }
        }
        
        // Start checking payment status
        const interval = setInterval(() => {
          checkPaymentStatus(data.orderId)
        }, 5000) // Check every 5 seconds
        setCheckInterval(interval)

        toast({
          title: 'Төлбөрийн хүсэлт үүсгэгдлээ',
          description: 'Төлбөрийн холбоос үүсгэгдлээ'
        })
      } else {
        throw new Error(data.error || 'Төлбөрийн хүсэлт үүсгэхэд алдаа гарлаа')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setStatus('failed')
      toast({
        title: 'Алдаа гарлаа',
        description: error instanceof Error ? error.message : 'Төлбөрийн хүсэлт үүсгэхэд алдаа гарлаа',
        variant: 'destructive'
      })
    }
  }

  // Removed test payment handler and QR preview in favor of provider link only

  const checkPaymentStatus = async (orderId: string) => {
    try {
      const response = await fetch(`/api/payments/status/${orderId}`)
      const data = await response.json()

      if (response.ok && data.status === 'completed') {
        setStatus('success')
        // Ensure user.enrolledCourses is updated (idempotent)
        try {
          await fetch('/api/users/enroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courseId: course._id })
          })
        } catch (e) {
          console.error('Enroll mirror save failed (prod):', e)
        }
        if (checkInterval) {
          clearInterval(checkInterval)
          setCheckInterval(null)
        }
        toast({
          title: 'Төлбөр амжилттай төлөгдлөө!',
          description: 'Та одоо хичээлээ үзэх боломжтой',
        })
        
        // Call success callback and redirect to course after 3 seconds
        setTimeout(() => {
          onPaymentSuccess?.()
          onClose()
          router.push(`/learn/${course._id}`)
        }, 3000)
      }
    } catch (error) {
      console.error('Status check error:', error)
    }
  }

  const handleRetry = () => {
    setStatus('idle')
    handlePayment()
  }

  const handleClose = async () => {
    if (checkInterval) {
      clearInterval(checkInterval)
      setCheckInterval(null)
    }
    // If an order exists and still pending, mark as failed (user closed modal)
    try {
      const shouldCancel = ['idle','loading','qr_ready','checking'].includes(status)
      if (orderId && shouldCancel) {
        await fetch(`/api/payments/cancel/${orderId}`, { method: 'POST' })
      }
    } catch (e) {
      console.error('Cancel pending order failed:', e)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Төлбөр төлөх</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span>Үнэ:</span>
                <span className="text-xl font-bold text-blue-600">
                  {course.price.toLocaleString()}₮
                </span>
              </div>
            </CardContent>
          </Card>

          {status === 'idle' && (
            <Button 
              onClick={handlePayment} 
              className="w-full"
              size="lg"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Бил-ээр төлөх
            </Button>
          )}

          {status === 'loading' && (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p>Төлбөрийн хүсэлт боловсруулж байна...</p>
            </div>
          )}

          {status === 'qr_ready' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center">Төлбөрийн мэдээлэл</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {payUrl ? (
                  <>
                    <p className="text-sm text-gray-600 mb-4">Дараах товчийг дарж төлбөрийн хуудсыг нээнэ үү.</p>
                    <Button asChild className="w-full mb-3">
                      <a href={payUrl} target="_blank" rel="noopener noreferrer">Төлбөрийн хуудсыг нээх</a>
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-gray-600 mb-4">Төлбөрийн холбоос үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.</p>
                )}
                <div className="text-xs text-gray-500 mb-4">
                  Захиалгын дугаар: {orderId}
                </div>
                <div className="flex items-center justify-center text-sm text-blue-600">
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Төлбөрийн статус шалгаж байна...
                </div>
              </CardContent>
            </Card>
          )}

          {status === 'success' && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-center text-green-700 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Төлбөр амжилттай!
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-green-700 mb-4">
                  Таны төлбөр амжилттай төлөгдлөө. Хичээл рүү шилжиж байна...
                </p>
              </CardContent>
            </Card>
          )}

          {status === 'failed' && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-center text-red-700 flex items-center justify-center">
                  <XCircle className="w-6 h-6 mr-2" />
                  Алдаа гарлаа
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-red-700 mb-4">
                  Төлбөрийн хүсэлт үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.
                </p>
                <Button onClick={handleRetry} variant="outline">
                  Дахин оролдох
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
