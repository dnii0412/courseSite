'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Settings, Palette, Grid3X3 } from 'lucide-react';
import Link from 'next/link';

export function GridFeatureSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Таны дурын хөтөлбөрийн самбар
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Хичээлүүдээ өөрийн хүссэнээр зохион байгуулж,
                        суралцах явцаа хянаарай
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left side - Feature description */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Grid3X3 className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Хувилжсан харагдац
                                    </h3>
                                    <p className="text-gray-600">
                                        Хичээлүүдээ өөрийн хүссэнээр зохион байгуулж,
                                        хамгийн тохиромжтой харагдацтай болгоорой
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Palette className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Өнгө, загвар
                                    </h3>
                                    <p className="text-gray-600">
                                        Өөрийн дуртай өнгө, загвараар самбараа тохируулж,
                                        илүү таатай орчинд суралцаарай
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Settings className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Тохиргоо
                                    </h3>
                                    <p className="text-gray-600">
                                        Суралцах хурд, хэл, мэдэгдэл зэргийг
                                        өөрийн хүссэнээр тохируулна уу
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                <Link href="/dashboard">Самбар үзэх</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right side - Grid preview */}
                    <div className="relative">
                        {/* Main grid container */}
                        <div className="relative w-full aspect-square max-w-md mx-auto">
                            {/* Background grid pattern */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6">
                                <div className="grid grid-cols-3 gap-3 h-full">
                                    {Array.from({ length: 9 }, (_, i) => (
                                        <div key={i} className="bg-white/60 rounded-lg"></div>
                                    ))}
                                </div>
                            </div>

                            {/* Course cards overlay */}
                            <div className="absolute inset-0 p-6">
                                <div className="grid grid-cols-3 gap-3 h-full">
                                    {/* Large featured course */}
                                    <div className="col-span-2 row-span-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 text-white relative group cursor-pointer transform hover:scale-105 transition-all duration-300">
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                                            <Play className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="h-full flex flex-col justify-between">
                                            <div className="text-right">
                                                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Топ</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm mb-1">React.js</h4>
                                                <p className="text-xs opacity-80">12 хичээл</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Small course cards */}
                                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-3 text-white relative group cursor-pointer transform hover:scale-105 transition-all duration-300">
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                                            <Play className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="h-full flex flex-col justify-between">
                                            <h4 className="font-semibold text-xs">Python</h4>
                                            <p className="text-xs opacity-80">8 хичээл</p>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-3 text-white relative group cursor-pointer transform hover:scale-105 transition-all duration-300">
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                                            <Play className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="h-full flex flex-col justify-between">
                                            <h4 className="font-semibold text-xs">UI/UX</h4>
                                            <p className="text-xs opacity-80">6 хичээл</p>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-3 text-white relative group cursor-pointer transform hover:scale-105 transition-all duration-300">
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                                            <Play className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="h-full flex flex-col justify-between">
                                            <h4 className="font-semibold text-xs">JavaScript</h4>
                                            <p className="text-xs opacity-80">10 хичээл</p>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-3 text-white relative group cursor-pointer transform hover:scale-105 transition-all duration-300">
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                                            <Play className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="h-full flex flex-col justify-between">
                                            <h4 className="font-semibold text-xs">Node.js</h4>
                                            <p className="text-xs opacity-80">7 хичээл</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating elements */}
                            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                ⚙️
                            </div>
                            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                🎨
                            </div>
                        </div>

                        {/* Feature highlights */}
                        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600 mb-1">6×4</div>
                                <p className="text-sm text-gray-600">Грид хэмжээ</p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600 mb-1">∞</div>
                                <p className="text-sm text-gray-600">Хувилжсан</p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 mb-1">24/7</div>
                                <p className="text-sm text-gray-600">Хандалт</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
