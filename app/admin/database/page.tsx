"use client"
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { 
  Database, 
  Server, 
  HardDrive, 
  Activity, 
  Shield, 
  RefreshCw, 
  Download, 
  Upload,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'

const databaseStats = {
  totalSize: '2.4 GB',
  usedSize: '1.8 GB',
  freeSize: '600 MB',
  usagePercentage: 75,
  connections: 24,
  maxConnections: 100,
  uptime: '99.9%',
  lastBackup: '2024.01.15 14:30',
  nextBackup: '2024.01.16 02:00',
  status: 'healthy'
}

const collections = [
  {
    name: 'users',
    size: '450 MB',
    documents: 1234,
    lastModified: '2024.01.15 16:45',
    status: 'active'
  },
  {
    name: 'courses',
    size: '320 MB',
    documents: 56,
    lastModified: '2024.01.15 15:20',
    status: 'active'
  },
  {
    name: 'enrollments',
    size: '280 MB',
    documents: 2340,
    lastModified: '2024.01.15 14:30',
    status: 'active'
  },
  {
    name: 'payments',
    size: '180 MB',
    documents: 890,
    lastModified: '2024.01.15 13:15',
    status: 'active'
  },
  {
    name: 'logs',
    size: '120 MB',
    documents: 5670,
    lastModified: '2024.01.15 12:00',
    status: 'archived'
  }
]

const recentOperations = [
  {
    id: 1,
    operation: 'Backup created',
    status: 'success',
    timestamp: '2024.01.15 14:30',
    duration: '2m 15s',
    size: '1.2 GB'
  },
  {
    id: 2,
    operation: 'Index optimization',
    status: 'success',
    timestamp: '2024.01.15 12:00',
    duration: '45s',
    size: null
  },
  {
    id: 3,
    operation: 'Data migration',
    status: 'running',
    timestamp: '2024.01.15 10:15',
    duration: '15m 30s',
    size: '800 MB'
  },
  {
    id: 4,
    operation: 'Backup verification',
    status: 'success',
    timestamp: '2024.01.15 08:45',
    duration: '1m 20s',
    size: null
  },
  {
    id: 5,
    operation: 'Security scan',
    status: 'warning',
    timestamp: '2024.01.15 06:30',
    duration: '5m 10s',
    size: null
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'healthy':
    case 'active':
    case 'success':
      return <Badge className="bg-green-100 text-green-800">Идэвхтэй</Badge>
    case 'running':
      return <Badge className="bg-blue-100 text-blue-800">Ажиллаж буй</Badge>
    case 'warning':
      return <Badge className="bg-yellow-100 text-yellow-800">Анхааруулга</Badge>
    case 'archived':
      return <Badge className="bg-gray-100 text-gray-800">Архивласан</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'running':
      return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

export default function AdminDatabasePage() {
  // Live infra stats
  const [live, setLive] = useState<any>(null)
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const r = await fetch('/api/admin/infra', { cache: 'no-store' })
        const j = await r.json()
        if (mounted) setLive(j)
      } catch {}
    }
    load()
    const id = setInterval(load, 10000)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [])
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Өгөгдлийн сан удирдлага
            </h1>
            <p className="text-gray-600">
              MongoDB өгөгдлийн сангийн төлөв, нөөц, аюулгүй байдлын удирдлага
            </p>
          </div>

          <div className="grid gap-6">
            {/* Database Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    MongoDB Collections
                  </CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {live?.mongo?.stats?.db || '—'} • {live?.mongo?.collections?.length ?? 0} collections
                    {live?.lastUpdated && <span className="ml-2">• {new Date(live.lastUpdated).toLocaleTimeString()}</span>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Bunny Videos
                  </CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{live?.bunny?.videosCount ?? 0}</div>
                  <p className="text-xs text-muted-foreground">Library: {live?.bunny?.libraryId || '—'}</p>
                  {live?.bunny?.totalSizeBytes != null && (
                    <p className="text-xs text-muted-foreground">Total size: {live.bunny.totalSizeBytes} bytes</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mongo Stats
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground break-words">
                    {live?.mongo?.stats ? JSON.stringify(live.mongo.stats) : '—'}
                  </div>
                  {live?.mongo?.connections && (
                    <div className="text-xs text-muted-foreground mt-2">Connections: {JSON.stringify(live.mongo.connections)}</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Webhook / Errors
                  </CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground break-words">
                    {live?.mongo?.error || live?.bunny?.error || 'OK'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Storage Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Хадгалах нөөц</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Ашигласан нөөц</span>
                      <span>{databaseStats.usagePercentage}%</span>
                    </div>
                    <Progress value={databaseStats.usagePercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{databaseStats.usedSize} ашигласан</span>
                      <span>{databaseStats.freeSize} үлдсэн</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collections (live) */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Коллекцууд</CardTitle>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Тохиргоо
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(live?.mongo?.collections || []).map((collection: any) => (
                    <div key={collection.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <HardDrive className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{collection.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {collection.count ?? '—'} баримт • {collection.storageSize ?? '—'} bytes
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {collection.lastModified}
                          </p>
                        </div>
                        {getStatusBadge(collection.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Operations */}
            <Card>
              <CardHeader>
                <CardTitle>Сүүлийн үйл ажиллагаа</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOperations.map((operation) => (
                    <div key={operation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(operation.status)}
                        <div>
                          <p className="font-medium">{operation.operation}</p>
                          <p className="text-sm text-muted-foreground">
                            {operation.timestamp} • {operation.duration}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {operation.size && (
                          <div className="text-right">
                            <p className="text-sm font-medium">{operation.size}</p>
                          </div>
                        )}
                        {getStatusBadge(operation.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Backup Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Нөөц хувилбар</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Автомат нөөц хувилбар</Label>
                      <p className="text-sm text-muted-foreground">
                        Өдөр бүр 02:00 цагт автоматаар нөөц хувилбар үүсгэх
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Сүүлийн нөөц хувилбар</Label>
                      <p className="text-sm text-muted-foreground">
                        {databaseStats.lastBackup}
                      </p>
                    </div>
                    <div>
                      <Label>Дараагийн нөөц хувилбар</Label>
                      <p className="text-sm text-muted-foreground">
                        {databaseStats.nextBackup}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Нөөц хувилбар татах
                    </Button>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Нөөц хувилбар сэргээх
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
