"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

interface PaymentModalProps {
  courseId: string
  courseTitle: string
  price: number
  onSuccess?: () => void
}

export function PaymentModal({ courseId, courseTitle, price, onSuccess }: PaymentModalProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('qpay')
  const [phoneNumber, setPhoneNumber] = useState('')

  const handlePayment = async () => {
    if (!session?.user) {
      toast({
        title: "Алдаа",
        description: "Нэвтрэх шаардлагатай",
        variant: "destructive",
      })
      return
    }

    if (!phoneNumber) {
      toast({
        title: "Алдаа",
        description: "Утасны дугаар оруулна уу",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          paymentMethod,
          phoneNumber,
          amount: price,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        if (paymentMethod === 'qpay') {
          // Redirect to QPay payment page
          window.open(data.paymentUrl, '_blank')
        } else if (paymentMethod === 'byl') {
          // Redirect to BYL payment page
          window.open(data.paymentUrl, '_blank')
        }
        
        toast({
          title: "Амжилттай",
          description: "Төлбөр төлөлт эхэллээ",
        })
        
        setIsOpen(false)
        onSuccess?.()
      } else {
        const error = await response.json()
        toast({
          title: "Алдаа",
          description: error.message || "Төлбөр төлөлт амжилтгүй",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Алдаа",
        description: "Серверийн алдаа гарлаа",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          Төлбөр төлөх
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Төлбөр төлөлт</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">{courseTitle}</h4>
            <p className="text-2xl font-bold text-blue-600">₮{price.toLocaleString()}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method">Төлбөр төлөх арга</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Төлбөр төлөх арга сонгох" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qpay">QPay</SelectItem>
                <SelectItem value="byl">BYL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Утасны дугаар</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Утасны дугаар"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <Button 
            onClick={handlePayment} 
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? 'Төлбөр төлж байна...' : 'Төлбөр төлөх'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
