'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, TrendingUp } from 'lucide-react';

export function StatsSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        New Era статистик
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Манай платформ дээр суралцаж буй сурагчдын амжилт
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Total Students */}
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader className="text-center pb-4">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-xl text-gray-900">Нийт сурагч</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">3,247</div>
                            <p className="text-gray-600">Идэвхтэй суралцагчид</p>
                        </CardContent>
                    </Card>

                    {/* Total Courses */}
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader className="text-center pb-4">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-xl text-gray-900">Нийт сургалт</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">156</div>
                            <p className="text-gray-600">Чанартай хичээлүүд</p>
                        </CardContent>
                    </Card>

                    {/* Completion Rate */}
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader className="text-center pb-4">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-xl text-gray-900">Дуусгах түвшин</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="text-4xl font-bold text-purple-600 mb-2">87%</div>
                            <p className="text-gray-600">Дундаж дуусгах түвшин</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional stats row */}
                <div className="mt-16 grid gap-8 md:grid-cols-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
                        <p className="text-gray-600">Дэмжлэг</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
                        <p className="text-gray-600">Мэргэжлийн багш</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">14</div>
                        <p className="text-gray-600">Хоногийн буцаалт</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">4.8/5</div>
                        <p className="text-gray-600">Үнэлгээ</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
