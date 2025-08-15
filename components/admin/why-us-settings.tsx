"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Video, DollarSign, Users, Clock, Plus, Trash2, Save, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface WhyUsItem {
    id: string
    icon: string
    title: string
    description: string
    color: string
    bgColor: string
    iconColor: string
    enabled: boolean
}

const availableIcons = [
    { value: 'Video', label: 'Video', component: Video },
    { value: 'DollarSign', label: 'Dollar Sign', component: DollarSign },
    { value: 'Users', label: 'Users', component: Users },
    { value: 'Clock', label: 'Clock', component: Clock }
]

const availableColors = [
    { value: 'from-blue-500 to-blue-600', label: 'Blue' },
    { value: 'from-green-500 to-green-600', label: 'Green' },
    { value: 'from-purple-500 to-purple-600', label: 'Purple' },
    { value: 'from-orange-500 to-orange-600', label: 'Orange' },
    { value: 'from-red-500 to-red-600', label: 'Red' },
    { value: 'from-indigo-500 to-indigo-600', label: 'Indigo' }
]

const availableBgColors = [
    { value: 'from-blue-50 to-blue-100', label: 'Blue Light' },
    { value: 'from-green-50 to-green-100', label: 'Green Light' },
    { value: 'from-purple-50 to-purple-100', label: 'Purple Light' },
    { value: 'from-orange-50 to-orange-100', label: 'Orange Light' },
    { value: 'from-red-50 to-red-100', label: 'Red Light' },
    { value: 'from-indigo-50 to-indigo-100', label: 'Indigo Light' }
]

const availableIconColors = [
    { value: 'text-blue-600', label: 'Blue' },
    { value: 'text-green-600', label: 'Green' },
    { value: 'text-purple-600', label: 'Purple' },
    { value: 'text-orange-600', label: 'Orange' },
    { value: 'text-red-600', label: 'Red' },
    { value: 'text-indigo-600', label: 'Indigo' }
]

export function WhyUsSettings() {
    const [items, setItems] = useState<WhyUsItem[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showPreview, setShowPreview] = useState(false)

    useEffect(() => {
        fetchWhyUsData()
    }, [])

    const fetchWhyUsData = async () => {
        try {
            const response = await fetch('/api/admin/why-us')
            if (response.ok) {
                const data = await response.json()
                setItems(data.data || [])
            }
        } catch (error) {
            console.error('Error fetching why-us data:', error)
            toast.error('Failed to fetch data')
        } finally {
            setLoading(false)
        }
    }

    const addNewItem = () => {
        const newItem: WhyUsItem = {
            id: Date.now().toString(),
            icon: 'Video',
            title: 'Шинэ онцлог',
            description: 'Шинэ онцлогийн тайлбар',
            color: 'from-blue-500 to-blue-600',
            bgColor: 'from-blue-50 to-blue-100',
            iconColor: 'text-blue-600',
            enabled: true
        }
        setItems([...items, newItem])
    }

    const updateItem = (id: string, field: keyof WhyUsItem, value: string | boolean) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ))
    }

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id))
    }

    const toggleItem = (id: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, enabled: !item.enabled } : item
        ))
    }

    const saveChanges = async () => {
        setSaving(true)
        try {
            const response = await fetch('/api/admin/why-us', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: items }),
            })

            if (response.ok) {
                toast.success('Why us section updated successfully')
            } else {
                toast.error('Failed to update')
            }
        } catch (error) {
            console.error('Error saving:', error)
            toast.error('Failed to save changes')
        } finally {
            setSaving(false)
        }
    }

    const getIconComponent = (iconName: string) => {
        const icon = availableIcons.find(i => i.value === iconName)
        return icon ? icon.component : Video
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Яагаад бид? Тохиргоо</h2>
                    <p className="text-gray-600">Нүүр хуудасны онцлогуудыг засварлах</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-2"
                    >
                        {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showPreview ? 'Хаах' : 'Урьдчилан харах'}
                    </Button>
                    <Button onClick={addNewItem} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Нэмэх
                    </Button>
                    <Button onClick={saveChanges} disabled={saving} className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        {saving ? 'Хадгалж байна...' : 'Хадгалах'}
                    </Button>
                </div>
            </div>

            {/* Live Preview */}
            {showPreview && (
                <Card className="border-2 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-blue-600">Урьдчилан харах</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {items.filter(item => item.enabled).map((item) => {
                                const IconComponent = getIconComponent(item.icon)
                                return (
                                    <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white">
                                        <CardHeader className="pb-4">
                                            <div className={`w-16 h-16 bg-gradient-to-br ${item.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                                <IconComponent className={`w-8 h-8 ${item.iconColor}`} />
                                            </div>
                                            <CardTitle className="text-lg text-gray-900">
                                                {item.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <p className="text-gray-600 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Editable Items */}
            <div className="grid gap-6">
                {items.map((item, index) => (
                    <Card key={item.id} className="border-l-4 border-blue-500">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500">#{index + 1}</span>
                                    <Input
                                        value={item.title}
                                        onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                                        placeholder="Гарчиг"
                                        className="max-w-xs"
                                    />
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleItem(item.id)}
                                        className={item.enabled ? 'text-green-600' : 'text-gray-400'}
                                    >
                                        {item.enabled ? 'Идэвхтэй' : 'Идэвхгүй'}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Тайлбар</Label>
                                    <Input
                                        value={item.description}
                                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                        placeholder="Тайлбар"
                                    />
                                </div>
                                <div>
                                    <Label>Дүрс</Label>
                                    <Select value={item.icon} onValueChange={(value) => updateItem(item.id, 'icon', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableIcons.map((icon) => (
                                                <SelectItem key={icon.value} value={icon.value}>
                                                    <div className="flex items-center gap-2">
                                                        <icon.component className="w-4 h-4" />
                                                        {icon.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label>Өнгө</Label>
                                    <Select value={item.color} onValueChange={(value) => updateItem(item.id, 'color', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableColors.map((color) => (
                                                <SelectItem key={color.value} value={color.value}>
                                                    {color.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Дэвсгэр өнгө</Label>
                                    <Select value={item.bgColor} onValueChange={(value) => updateItem(item.id, 'bgColor', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableBgColors.map((color) => (
                                                <SelectItem key={color.value} value={color.value}>
                                                    {color.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Дүрсний өнгө</Label>
                                    <Select value={item.iconColor} onValueChange={(value) => updateItem(item.id, 'iconColor', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableIconColors.map((color) => (
                                                <SelectItem key={color.value} value={color.value}>
                                                    {color.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {items.length === 0 && (
                <Card className="text-center py-12">
                    <CardContent>
                        <p className="text-gray-500 mb-4">Онцлог байхгүй байна</p>
                        <Button onClick={addNewItem}>Эхний онцлог нэмэх</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
