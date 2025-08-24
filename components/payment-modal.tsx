"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Loader2 } from "lucide-react"
import type { Course } from "@/lib/types"

interface PaymentModalProps {
  course: Course
  onClose: () => void
}

interface QPayInvoice {
  invoice_id: string
  qr_text: string
  qr_image: string
  urls: Array<{
    name: string
    description: string
    logo: string
    link: string
  }>
}

interface BylCheckout {
  id: number
  url: string
  status: string
  amount_total: number
}

export function PaymentModal({ course, onClose }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("qpay")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [qpayInvoice, setQpayInvoice] = useState<QPayInvoice | null>(null)
  const [bylCheckout, setBylCheckout] = useState<BylCheckout | null>(null)
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<string>("pending")

  const handlePayment = async () => {
    if (paymentMethod === "qpay" && !phoneNumber) {
      alert("Утасны дугаар оруулна уу")
      return
    }

    setLoading(true)
    try {
      if (paymentMethod === "qpay") {
        const response = await fetch("/api/payments/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: course._id,
            phoneNumber,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setQpayInvoice(data.qpayInvoice)
          setPaymentId(data.paymentId)
          startPaymentCheck(data.paymentId)
        } else {
          const error = await response.json()
          alert(error.error || "Төлбөр үүсгэхэд алдаа гарлаа")
        }
      } else if (paymentMethod === "byl") {
        const response = await fetch("/api/payments/byl/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: course._id,
            paymentMethod: "checkout"
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setBylCheckout(data.bylCheckout)
          setPaymentId(data.paymentId)
          // For Byl checkout, redirect to their payment page
          window.open(data.bylCheckout.url, "_blank")
        } else {
          const error = await response.json()
          alert(error.error || "Төлбөр үүсгэхэд алдаа гарлаа")
        }
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Төлбөр үүсгэхэд алдаа гарлаа")
    } finally {
      setLoading(false)
    }
  }

  const startPaymentCheck = (paymentId: string) => {
    const checkInterval = setInterval(async () => {
      try {
        const response = await fetch("/api/payments/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId }),
        })

        if (response.ok) {
          const data = await response.json()
          setPaymentStatus(data.status)

          if (data.status === "completed") {
            clearInterval(checkInterval)
            alert("Төлбөр амжилттай төлөгдлөө! Хичээлд бүртгэгдлээ.")
            onClose()
            window.location.reload() // Refresh to show enrollment
          }
        }
      } catch (error) {
  
      }
    }, 3000) // Check every 3 seconds

    // Stop checking after 10 minutes
    setTimeout(() => {
      clearInterval(checkInterval)
    }, 600000)
  }

  const openQPayApp = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Төлбөр төлөлт</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {!qpayInvoice && !bylCheckout ? (
            <>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <div className="text-2xl font-bold text-primary mt-2">₮{course.price.toLocaleString()}</div>
              </div>

              <div>
                <Label htmlFor="paymentMethod">Төлбөр төлөх арга</Label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                >
                  <option value="qpay">QPay</option>
                  <option value="byl">Byl</option>
                </select>
              </div>

              {paymentMethod === "qpay" && (
                <div>
                  <Label htmlFor="phoneNumber">Утасны дугаар</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Утасны дугаар"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="duration">Тоо ширхэг</Label>
                <select id="duration" className="w-full p-2 border rounded-md mt-1">
                  <option value="1">1 хичээл</option>
                </select>
              </div>

              <Button onClick={handlePayment} disabled={loading} className="w-full bg-primary hover:bg-primary/90">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Төлбөр үүсгэж байна...
                  </>
                ) : (
                  "Төлбөр төлөх"
                )}
              </Button>
            </>
          ) : qpayInvoice ? (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">QPay төлбөр</h3>
                <div className="text-sm text-gray-600 mb-4">
                  {paymentStatus === "completed" ? "Төлбөр амжилттай төлөгдлөө!" : "Төлбөр хүлээж байна..."}
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg border inline-block">
                  <img src={qpayInvoice.qr_image || "/placeholder.svg"} alt="QPay QR Code" className="w-48 h-48" />
                </div>
                <p className="text-sm text-gray-600 mt-2">QR код уншуулж төлбөр төлнө үү</p>
              </div>

              {/* QPay Apps */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-center">Эсвэл аппликейшнээр нээх:</p>
                <div className="grid grid-cols-2 gap-2">
                  {qpayInvoice.urls.map((app, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => openQPayApp(app.link)}
                      className="flex items-center gap-2"
                    >
                      <img src={app.logo || "/placeholder.svg"} alt={app.name} className="w-4 h-4" />
                      {app.name}
                    </Button>
                  ))}
                </div>
              </div>

              {paymentStatus === "pending" && (
                <div className="text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Төлбөр хүлээж байна...</p>
                </div>
              )}
            </div>
          ) : bylCheckout ? (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Byl төлбөр</h3>
                <div className="text-sm text-gray-600 mb-4">
                  Төлбөрийн хуудас нээгдлээ. Хэрэв автоматаар нээгдээгүй бол доорх товчлуурыг дарна уу.
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => window.open(bylCheckout.url, "_blank")}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Төлбөрийн хуудас нээх
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>Төлбөр төлөгдсөний дараа автоматаар хичээлд бүртгэгдэх болно.</p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
