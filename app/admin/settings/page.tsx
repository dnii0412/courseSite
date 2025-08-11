import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save, Globe, Bell, Shield, CreditCard } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Тохиргоо
            </h1>
            <p className="text-gray-600">
              Системийн ерөнхий тохиргоонууд
            </p>
          </div>

          <div className="grid gap-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Ерөнхий тохиргоо
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Сайтын нэр</Label>
                    <Input id="siteName" defaultValue="New Era" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">Сайтын хаяг</Label>
                    <Input id="siteUrl" defaultValue="https://newera.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Тайлбар</Label>
                  <Textarea
                    id="description"
                    defaultValue="New Era - Онлайн сургалтын платформ"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Хэл</Label>
                    <Select defaultValue="mn">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mn">Монгол</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Цагийн бүс</Label>
                    <Select defaultValue="asia/ulaanbaatar">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asia/ulaanbaatar">Улаанбаатар (UTC+8)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Мэдэгдлийн тохиргоо
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Имэйл мэдэгдэл</Label>
                    <p className="text-sm text-muted-foreground">
                      Шинэ элсэлт, төлбөр зэргийн мэдэгдэл
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push мэдэгдэл</Label>
                    <p className="text-sm text-muted-foreground">
                      Вэб хөтөч дээрх мэдэгдэл
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>СМС мэдэгдэл</Label>
                    <p className="text-sm text-muted-foreground">
                      Утасны дугаар руу СМС илгээх
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Payment Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Төлбөрийн тохиргоо
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Валют</Label>
                    <Select defaultValue="mnt">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mnt">₮ MNT</SelectItem>
                        <SelectItem value="usd">$ USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Татварын хувь (%)</Label>
                    <Input id="taxRate" type="number" defaultValue="10" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>QPay төлбөр</Label>
                    <p className="text-sm text-muted-foreground">
                      QPay төлбөрийн системийг идэвхжүүлэх
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Аюулгүй байдлын тохиргоо
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>2FA нэвтрэх</Label>
                    <p className="text-sm text-muted-foreground">
                      Хоёр хүчин зүйлт баталгаажуулалт
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Нууц үгийн хүч</Label>
                    <p className="text-sm text-muted-foreground">
                      Хүчтэй нууц үг шаардах
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Сессийн хугацаа (минут)</Label>
                  <Input id="sessionTimeout" type="number" defaultValue="30" />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Тохиргоог хадгалах
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
