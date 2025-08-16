"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trophy, Users, Star, Target, TrendingUp, Award, Plus, Trash2, Save } from 'lucide-react'
import { toast } from 'sonner'

interface StatCard {
    id: string
    title: string
    value: string
    description: string
    icon: string
    color: string
    bgColor: string
}

const availableIcons = [
    { value: 'Users', label: 'Users', icon: Users },
    { value: 'Star', label: 'Star', icon: Star },
    { value: 'Trophy', label: 'Trophy', icon: Trophy },
    { value: 'Target', label: 'Target', icon: Target },
    { value: 'TrendingUp', label: 'Trending Up', icon: TrendingUp },
    { value: 'Award', label: 'Award', icon: Award }
]

const availableColors = [
    { value: 'text-blue-600', label: 'Blue', bgColor: 'bg-blue-100' },
    { value: 'text-green-600', label: 'Green', bgColor: 'bg-green-100' },
    { value: 'text-yellow-600', label: 'Yellow', bgColor: 'bg-yellow-100' },
    { value: 'text-purple-600', label: 'Purple', bgColor: 'bg-purple-100' },
    { value: 'text-red-600', label: 'Red', bgColor: 'bg-red-100' },
    { value: 'text-indigo-600', label: 'Indigo', bgColor: 'bg-indigo-100' },
    { value: 'text-pink-600', label: 'Pink', bgColor: 'bg-pink-100' },
    { value: 'text-orange-600', label: 'Orange', bgColor: 'bg-orange-100' }
]

export function StatsSettings() {
    const [stats, setStats] = useState<StatCard[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats')
            if (response.ok) {
                const data = await response.json()
                console.log('Fetched stats data:', data)
                
                // Ensure all stats have valid IDs
                const statsWithIds = (data.stats || []).map((stat: any, index: number) => ({
                    ...stat,
                    id: stat.id || `stat_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`
                }))
                
                console.log('Processed stats with IDs:', statsWithIds)
                setStats(statsWithIds)
                
                // Set last saved time if we have data
                if (statsWithIds.length > 0) {
                    setLastSaved(new Date())
                }
            } else {
                // Load default stats if API fails
                const defaultStats = [
                    {
                        id: `stat_1_${Date.now()}_1`,
                        title: 'Нийт сурагч',
                        value: '3,200+',
                        description: 'Идэвхтэй суралцаж буй сурагчид',
                        icon: 'Users',
                        color: 'text-blue-600',
                        bgColor: 'bg-blue-100'
                    },
                    {
                        id: `stat_2_${Date.now()}_2`,
                        title: 'Дундаж үнэлгээ',
                        value: '4.8/5',
                        description: 'Сурагчдын сэтгэгдэл',
                        icon: 'Star',
                        color: 'text-yellow-600',
                        bgColor: 'bg-yellow-100'
                    },
                    {
                        id: `stat_3_${Date.now()}_3`,
                        title: 'Хичээл дуусгасан',
                        value: '15,000+',
                        description: 'Амжилттай төгссөн хичээлүүд',
                        icon: 'Trophy',
                        color: 'text-green-600',
                        bgColor: 'bg-green-100'
                    },
                    {
                        id: `stat_4_${Date.now()}_4`,
                        title: 'Амжилтын хувь',
                        value: '94%',
                        description: 'Сурагчдын амжилттай төгсөлт',
                        icon: 'Target',
                        color: 'text-purple-600',
                        bgColor: 'bg-purple-100'
                    },
                    {
                        id: `stat_5_${Date.now()}_5`,
                        title: 'Хурдтай өсөлт',
                        value: '+127%',
                        description: 'Энэ жилийн өсөлт',
                        icon: 'TrendingUp',
                        color: 'text-red-600',
                        bgColor: 'bg-red-100'
                    },
                    {
                        id: `stat_6_${Date.now()}_6`,
                        title: 'Гэрчилгээ',
                        value: '12,500+',
                        description: 'Олгосон гэрчилгээнүүд',
                        icon: 'Award',
                        color: 'text-indigo-600',
                        bgColor: 'bg-indigo-100'
                    }
                ]
                setStats(defaultStats)
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    const addNewStat = () => {
        const newStat: StatCard = {
            id: `stat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: 'Шинэ статистик',
            value: '0',
            description: 'Тайлбар оруулна уу',
            icon: 'Users',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        }
        setStats([...stats, newStat])
    }

    const updateStat = (id: string, field: keyof StatCard, value: string) => {
        setStats(stats.map(stat => {
            if (stat.id === id) {
                const updatedStat = { ...stat, [field]: value }
                // Update bgColor when color changes
                if (field === 'color') {
                    const colorOption = availableColors.find(c => c.value === value)
                    if (colorOption) {
                        updatedStat.bgColor = colorOption.bgColor
                    }
                }
                return updatedStat
            }
            return stat
        }))
    }

    const removeStat = (id: string) => {
        setStats(stats.filter(stat => stat.id !== id))
    }

    const saveStats = async () => {
        setSaving(true)
        try {
            const response = await fetch('/api/admin/stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ stats })
            })

            if (response.ok) {
                setLastSaved(new Date())
                toast.success('Статистик амжилттай хадгалагдлаа')
            } else {
                toast.error('Хадгалахад алдаа гарлаа')
            }
        } catch (error) {
            console.error('Error saving stats:', error)
            toast.error('Серверийн алдаа')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Статистик тохиргоо</h2>
                    <p className="text-gray-600">Нүүр хуудасны статистик хэсгийг удирдах</p>
                    {lastSaved && (
                        <p className="text-sm text-green-600 mt-1">
                            ✅ Сүүлд хадгалагдсан: {lastSaved.toLocaleString()}
                        </p>
                    )}
                </div>
                <div className="flex gap-3">
                    <Button onClick={addNewStat} variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Шинэ статистик
                    </Button>
                    <Button 
                        onClick={saveStats} 
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Хадгалж байна...' : '💾 Хадгалах'}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {stats.map((stat, index) => {
                    // Debug logging
                    console.log('Rendering stat:', { id: stat.id, title: stat.title, index })
                    
                    // Ensure stat has a valid ID
                    if (!stat.id) {
                        console.warn('Stat missing ID:', stat)
                        return null
                    }
                    
                    return (
                        <Card key={stat.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Статистик #{index + 1}</CardTitle>
                                    <Button
                                        onClick={() => removeStat(stat.id)}
                                        variant="destructive"
                                        size="sm"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Устгах
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`title-${stat.id}`}>Гарчиг</Label>
                                        <Input
                                            id={`title-${stat.id}`}
                                            value={stat.title}
                                            onChange={(e) => updateStat(stat.id, 'title', e.target.value)}
                                            placeholder="Жишээ: Нийт сурагч"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`value-${stat.id}`}>Утга</Label>
                                        <Input
                                            id={`value-${stat.id}`}
                                            value={stat.value}
                                            onChange={(e) => updateStat(stat.id, 'value', e.target.value)}
                                            placeholder="Жишээ: 3,200+"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`description-${stat.id}`}>Тайлбар</Label>
                                    <Input
                                        id={`description-${stat.id}`}
                                        value={stat.description}
                                        onChange={(e) => updateStat(stat.id, 'description', e.target.value)}
                                        placeholder="Жишээ: Идэвхтэй суралцаж буй сурагчид"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`icon-${stat.id}`}>Зураг</Label>
                                        <Select
                                            value={stat.icon}
                                            onValueChange={(value) => updateStat(stat.id, 'icon', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableIcons.map((iconOption) => {
                                                    return (
                                                        <SelectItem key={iconOption.value} value={iconOption.value}>
                                                            <div className="flex items-center gap-2">
                                                                {(() => {
                                                                    const IconComponent = iconOption.icon
                                                                    return <IconComponent className="w-4 h-4" />
                                                                })()}
                                                                {iconOption.label}
                                                            </div>
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`color-${stat.id}`}>Өнгө</Label>
                                        <Select
                                            value={stat.color}
                                            onValueChange={(value) => updateStat(stat.id, 'color', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableColors.map((colorOption) => (
                                                    <SelectItem key={colorOption.value} value={colorOption.value}>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-4 h-4 rounded-full ${colorOption.bgColor}`}></div>
                                                            {colorOption.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="border-t pt-4">
                                    <Label className="text-sm text-gray-600">Урьдчилан харах:</Label>
                                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                                                {(() => {
                                                    const iconOption = availableIcons.find(i => i.value === stat.icon)
                                                    if (iconOption) {
                                                        const IconComponent = iconOption.icon
                                                        return <IconComponent className={`w-4 h-4 ${stat.color}`} />
                                                    }
                                                    return null
                                                })()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{stat.value}</div>
                                                <div className="text-sm text-gray-600">{stat.title}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {stats.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">Одоогоор статистик оруулаагүй байна</p>
                    <Button onClick={addNewStat}>
                        <Plus className="w-4 h-4 mr-2" />
                        Эхний статистик нэмэх
                    </Button>
                </div>
            )}
        </div>
    )
}
