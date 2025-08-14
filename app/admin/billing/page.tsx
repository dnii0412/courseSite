'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RefreshCw, DollarSign, AlertTriangle, ExternalLink, Info } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface BillingData {
  amountUsd: number
  periodStart: string
  periodEnd: string
  fetchedAt: string
}

interface BillingSettings {
  monthlyBudgetUsd: number
  alert80SentAt: string | null
  alert100SentAt: string | null
  updatedAt: string
}

export default function AdminBillingPage() {
  const [billingData, setBillingData] = useState<BillingData | null>(null)
  const [settings, setSettings] = useState<BillingSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [budget, setBudget] = useState(20)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch settings and billing data in parallel
      const [settingsRes, billingRes] = await Promise.all([
        fetch('/api/billing/settings'),
        fetch('/api/billing/atlas-summary')
      ])

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        setSettings(settingsData.data)
        setBudget(settingsData.data.monthlyBudgetUsd)
      }

      if (billingRes.ok) {
        const billingData = await billingRes.json()
        setBillingData(billingData.data)
      }
    } catch (err) {
      setError('Failed to fetch billing data')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  const handleSaveBudget = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/billing/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthlyBudgetUsd: budget })
      })

      if (res.ok) {
        const data = await res.json()
        setSettings(data.data)
        setBudget(data.data.monthlyBudgetUsd)
      }
    } catch (err) {
      setError('Failed to save budget')
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = () => {
    if (!billingData || !settings) return null
    
    const percentage = (billingData.amountUsd / settings.monthlyBudgetUsd) * 100
    
    if (percentage >= 100) {
      return <Badge className="bg-red-100 text-red-800">OVER</Badge>
    } else if (percentage >= 80) {
      return <Badge className="bg-yellow-100 text-yellow-800">NEAR LIMIT</Badge>
    } else {
      return <Badge className="bg-green-100 text-green-800">OK</Badge>
    }
  }

  const getAtlasAlertsUrl = () => {
    const orgId = process.env.NEXT_PUBLIC_ATLAS_ORG_ID
    const projectId = process.env.NEXT_PUBLIC_ATLAS_PROJECT_ID
    
    if (orgId && projectId) {
      return `https://cloud.mongodb.com/v2#/org/${orgId}/projects/${projectId}/alerts`
    }
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-ink-900">Cost Guard</h1>
          <p className="text-ink-600 mt-2">Monitor and control your MongoDB Atlas spending</p>
        </div>

        {/* Atlas Connection Banner */}
        {!billingData && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Connect Atlas API keys to enable live billing monitoring. 
              <Button variant="link" className="p-0 h-auto" onClick={() => window.open('https://docs.atlas.mongodb.com/configure-api-access/', '_blank')}>
                View documentation
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Budget Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Monthly Budget (USD)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="budget">Budget Amount</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="budget"
                    type="number"
                    min="1"
                    max="1000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSaveBudget} 
                    disabled={saving || budget === settings?.monthlyBudgetUsd}
                    size="sm"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
              {settings && (
                <p className="text-sm text-ink-500">
                  Last updated: {formatDate(settings.updatedAt)}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Atlas Spend Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Atlas Spend (This Month)
                </span>
                {getStatusBadge()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {billingData ? (
                <>
                  <div className="text-3xl font-bold text-ink-900">
                    ${billingData.amountUsd.toFixed(2)}
                  </div>
                  <div className="text-sm text-ink-500 space-y-1">
                    <p>Period: {formatDate(billingData.periodStart)} - {formatDate(billingData.periodEnd)}</p>
                    <p>Last sync: {formatDate(billingData.fetchedAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleRefresh} 
                      disabled={refreshing}
                      size="sm"
                      variant="outline"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    {getAtlasAlertsUrl() && (
                      <Button 
                        onClick={() => window.open(getAtlasAlertsUrl()!, '_blank')}
                        size="sm"
                        variant="outline"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Atlas Alerts
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-ink-400 mx-auto mb-4" />
                  <p className="text-ink-500">Not connected</p>
                  <p className="text-sm text-ink-400 mt-1">
                    Configure Atlas API keys to view live billing data
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Required Environment Variables:</h4>
                <code className="block bg-gray-100 p-2 rounded text-xs">
                  ATLAS_PUBLIC_KEY=your_public_key<br/>
                  ATLAS_PRIVATE_KEY=your_private_key<br/>
                  ATLAS_PROJECT_ID=your_project_id<br/>
                  ATLAS_ORG_ID=your_org_id
                </code>
              </div>
              <div>
                <h4 className="font-medium mb-2">Optional:</h4>
                <code className="block bg-gray-100 p-2 rounded text-xs">
                  RESEND_API_KEY=your_resend_key<br/>
                  CRON_SECRET=your_cron_secret
                </code>
              </div>
            </div>
            <div className="text-sm text-ink-600">
              <p>• The system will automatically check billing daily at 9 AM UTC</p>
              <p>• Alerts are created when spending reaches 80% and 100% of your budget</p>
              <p>• Budget changes are saved immediately and persist across sessions</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
