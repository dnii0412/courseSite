'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QrCode, CreditCard, CheckCircle, XCircle, RefreshCw, TestTube } from 'lucide-react'
import Image from 'next/image'
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
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(null)
  const [isTestMode, setIsTestMode] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStatus('idle')
      setQrCode(null)
      setOrderId(null)
      setIsTestMode(false)
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
        setQrCode(data.qrImage)
        setOrderId(data.orderId)
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
          description: isTestMode ? 'Тест горимд QR код үүсгэгдлээ' : 'QR код-оор төлбөр төлнө үү'
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

  const handleTestPayment = async () => {
    if (!orderId) return

    try {
      const response = await fetch(`/api/payments/test/complete/${orderId}`, {
        method: 'POST'
      })

      if (response.ok) {
        setStatus('success')
        // Ensure user.enrolledCourses is updated (idempotent)
        try {
          await fetch('/api/users/enroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courseId: course._id })
          })
        } catch (e) {
          console.error('Enroll mirror save failed (test):', e)
        }
        if (checkInterval) {
          clearInterval(checkInterval)
          setCheckInterval(null)
        }
        toast({
          title: 'Тест төлбөр амжилттай!',
          description: 'Та одоо хичээлээ үзэх боломжтой',
        })
        
        // Call success callback and redirect to course after 3 seconds
        setTimeout(() => {
          onPaymentSuccess?.()
          onClose()
          router.push(`/learn/${course._id}`)
        }, 3000)
      } else {
        throw new Error('Тест төлбөр төлөхэд алдаа гарлаа')
      }
    } catch (error) {
      toast({
        title: 'Тест төлбөрийн алдаа',
        description: 'Дахин оролдоно уу',
        variant: 'destructive'
      })
    }
  }

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

          {status === 'qr_ready' && qrCode && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center">
                  {isTestMode && <TestTube className="w-5 h-5 mr-2 text-orange-500" />}
                  QR код скан хийнэ үү
                  {isTestMode && <span className="text-xs text-orange-500 ml-2">(Тест)</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative w-[200px] h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    {isTestMode && qrCode.includes('api.qrserver.com') ? (
                      <Image
                        src={qrCode}
                        alt="Test QR Code"
                        width={200}
                        height={200}
                        className="rounded-lg"
                      />
                    ) : isTestMode ? (
                      <div className="text-center">
                        <TestTube className="w-12 h-12 mx-auto mb-2 text-orange-500" />
                        <p className="text-sm text-gray-600">Тест QR код</p>
                        <p className="text-xs text-gray-500">200x200px</p>
                      </div>
                    ) : (
                      <Image
                        src={qrCode}
                        alt="Byl QR Code"
                        width={200}
                        height={200}
                        className="rounded-lg"
                      />
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {isTestMode 
                    ? 'Тест горимд байна. Доорх товчийг дарж төлбөр төлөх боломжтой.'
                    : 'Бил апп-аар QR код скан хийж төлбөр төлнө үү'
                  }
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  Захиалгын дугаар: {orderId}
                </div>
                
                {isTestMode ? (
                  <Button 
                    onClick={handleTestPayment}
                    className="w-full"
                    variant="outline"
                  >
                    <TestTube className="w-4 h-4 mr-2" />
                    Тест төлбөр төлөх
                  </Button>
                ) : (
                  <div className="flex items-center justify-center text-sm text-blue-600">
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Төлбөрийн статус шалгаж байна...
                  </div>
                )}
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
