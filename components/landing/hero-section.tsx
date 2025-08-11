'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Play, Star, Users, Shield } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#F8F4F1] via-white to-[#F0F8FF] py-20 lg:py-32">
            {/* Background gradient elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
                    {/* Left Column - Content */}
                    <div className="space-y-8 text-center lg:text-left">
                        {/* Eyebrow text */}
                        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            🚀 Онлайн сургалтын платформ
                        </div>

                        {/* Main headline */}
                        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Чанартай хичээлүүд.
                            <br />
                            <span className="text-blue-600">Хэзээ ч, хаанаас ч.</span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                            Мэргэжлийн багш нартай, чанартай видео хичээлүүдээр таны ур чадварыг хөгжүүлнэ.
                            Хугацаа, байршлаас үл хамааран суралцаарай.
                        </p>

                        {/* Search bar */}
                        <div className="relative max-w-md mx-auto lg:mx-0">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Хичээл хайх..."
                                className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-lg"
                            />
                        </div>

                        {/* CTA buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button asChild size="lg" className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                <Link href="/auth/register">Бүртгүүлэх — үнэгүй эхлэх</Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                <Link href="/courses">Хичээлүүдийг үзэх</Link>
                            </Button>
                        </div>

                        {/* Trust metrics */}
                        <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                <span>3,200+ сурагч</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500" />
                                <span>4.8/5 үнэлгээ</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-green-600" />
                                <span>14 хоногийн буцаалт</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Product Preview */}
                    <div className="relative flex justify-center items-center">
                        {/* Main course video card */}
                        <div className="relative w-80 h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden group">
                            {/* Video thumbnail */}
                            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                <div className="text-white text-center">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
                                        <Play className="w-8 h-8 text-white ml-1" />
                                    </div>
                                    <p className="text-lg font-semibold">React.js Хичээл</p>
                                    <p className="text-sm opacity-80">Багш: Б.Бат</p>
                                </div>
                            </div>

                            {/* Play button overlay */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                    <Play className="w-10 h-10 text-blue-600 ml-1" />
                                </div>
                            </div>

                            {/* Floating elements */}
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">
                                ⭐
                            </div>
                        </div>

                        {/* Stacked mini course cards behind */}
                        <div className="absolute -bottom-8 -left-8 w-48 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-xl transform rotate-12 opacity-80">
                            <div className="p-4 text-white">
                                <p className="font-semibold">UI/UX Дизайн</p>
                                <p className="text-sm opacity-80">Багш: Д.Сүхээ</p>
                            </div>
                        </div>

                        <div className="absolute -top-8 -right-8 w-48 h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-xl transform -rotate-12 opacity-80">
                            <div className="p-4 text-white">
                                <p className="font-semibold">Python Програмчлал</p>
                                <p className="text-sm opacity-80">Багш: Л.Мөнх</p>
                            </div>
                        </div>

                        {/* Floating particles */}
                        <div className="absolute top-10 left-10 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-60"></div>
                        <div className="absolute top-20 right-16 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60 delay-300"></div>
                        <div className="absolute bottom-16 left-20 w-4 h-4 bg-green-400 rounded-full animate-bounce opacity-60 delay-500"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
