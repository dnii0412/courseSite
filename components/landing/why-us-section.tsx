'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, DollarSign, Users, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

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

// Fallback benefits if API fails
const fallbackBenefits = [
    {
        icon: Video,
        title: 'Чанартай видео & аудио',
        description: 'HD чанартай видео, тод аудио, мөн интерактив элементүүдтэй хичээлүүд',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'from-blue-50 to-blue-100',
        iconColor: 'text-blue-600',
    },
    {
        icon: DollarSign,
        title: 'Уян хатан & хямд үнэ',
        description: 'Өөр өөр төлөвлөгөөтэй, таны хэмжээнд тохирсон үнэтэй сургалтууд',
        color: 'from-green-500 to-green-600',
        bgColor: 'from-green-50 to-green-100',
        iconColor: 'text-green-600',
    },
    {
        icon: Users,
        title: 'Мэргэжлийн багш нар',
        description: 'Тус салбарын мэргэжлийн багш нартай, практик туршлагатай сургалтууд',
        color: 'from-purple-500 to-purple-600',
        bgColor: 'from-purple-50 to-purple-100',
        iconColor: 'text-purple-600',
    },
    {
        icon: Clock,
        title: 'Өөрийн хурдаар суралцах',
        description: 'Хугацаа, байршлаас үл хамааран, өөрийн хурдаар суралцаарай',
        color: 'from-orange-500 to-orange-600',
        bgColor: 'from-orange-50 to-orange-100',
        iconColor: 'text-orange-600',
    },
];

export function WhyUsSection() {
    const [benefits, setBenefits] = useState(fallbackBenefits);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWhyUsData();
    }, []);

    const fetchWhyUsData = async () => {
        try {
            const response = await fetch('/api/admin/why-us');
            if (response.ok) {
                const data = await response.json();
                if (data.data && data.data.length > 0) {
                    // Filter enabled items and map icon names to components
                    const enabledItems = data.data.filter((item: WhyUsItem) => item.enabled);
                    const mappedBenefits = enabledItems.map((item: WhyUsItem) => {
                        const iconMap: { [key: string]: any } = {
                            Video,
                            DollarSign,
                            Users,
                            Clock
                        };
                        return {
                            icon: iconMap[item.icon] || Video,
                            title: item.title,
                            description: item.description,
                            color: item.color,
                            bgColor: item.bgColor,
                            iconColor: item.iconColor,
                        };
                    });
                    setBenefits(mappedBenefits);
                }
            }
        } catch (error) {
            console.error('Error fetching why-us data:', error);
            // Keep fallback benefits if API fails
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="bg-white py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Уншиж байна...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Яагаад бид?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Манай платформын давуу талууд
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {benefits.map((benefit, index) => (
                        <Card
                            key={index}
                            className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white text-center"
                        >
                            <CardHeader className="pb-4">
                                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <benefit.icon className={`w-8 h-8 ${benefit.iconColor}`} />
                                </div>
                                <CardTitle className="text-lg text-gray-900">
                                    {benefit.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <p className="text-gray-600 leading-relaxed">
                                    {benefit.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
