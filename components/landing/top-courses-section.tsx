'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Clock, Users, Play } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const categories = [
    { id: 'all', name: 'Бүгд', color: 'bg-gray-500' },
    { id: 'tech', name: 'Технологи', color: 'bg-blue-500' },
    { id: 'design', name: 'Дизайн', color: 'bg-purple-500' },
    { id: 'business', name: 'Бизнес', color: 'bg-green-500' },
    { id: 'language', name: 'Хэл', color: 'bg-yellow-500' },
];

const courses = [
    {
        id: 1,
        title: 'React.js - Мэргэжлийн түвшин',
        instructor: 'Б.Бат',
        rating: 4.9,
        students: 1247,
        duration: '12 цаг',
        price: '₮89,000',
        image: '/placeholder.jpg',
        category: 'tech',
        featured: true,
    },
    {
        id: 2,
        title: 'UI/UX Дизайн - Figma ашиглан',
        instructor: 'Д.Сүхээ',
        rating: 4.8,
        students: 892,
        duration: '8 цаг',
        price: '₮65,000',
        image: '/placeholder.jpg',
        category: 'design',
        featured: true,
    },
    {
        id: 3,
        title: 'Python - Машин сургалт',
        instructor: 'Л.Мөнх',
        rating: 4.7,
        students: 1563,
        duration: '15 цаг',
        price: '₮95,000',
        image: '/placeholder.jpg',
        category: 'tech',
        featured: true,
    },
    {
        id: 4,
        title: 'Бизнес стратеги - Стартап',
        instructor: 'Н.Оюун',
        rating: 4.6,
        students: 634,
        duration: '10 цаг',
        price: '₮75,000',
        image: '/placeholder.jpg',
        category: 'business',
        featured: false,
    },
    {
        id: 5,
        title: 'Англи хэл - IELTS 7.0+',
        instructor: 'С.Болор',
        rating: 4.9,
        students: 2103,
        duration: '20 цаг',
        price: '₮120,000',
        image: '/placeholder.jpg',
        category: 'language',
        featured: false,
    },
    {
        id: 6,
        title: 'JavaScript - ES6+ онцлогууд',
        instructor: 'Т.Ганбаатар',
        rating: 4.8,
        students: 987,
        duration: '14 цаг',
        price: '₮85,000',
        image: '/placeholder.jpg',
        category: 'tech',
        featured: false,
    },
];

export function TopCoursesSection() {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredCourses = selectedCategory === 'all'
        ? courses
        : courses.filter(course => course.category === selectedCategory);

    const featuredCourses = courses.filter(course => course.featured);

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Топ хичээлүүд
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Олон сурагчдын сонгосон, чанартай хичээлүүд
                    </p>
                </div>

                {/* Category filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? 'default' : 'outline'}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`rounded-full px-6 py-2 ${selectedCategory === category.id
                                    ? 'bg-blue-600 text-white'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>

                {/* Featured courses grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
                    {featuredCourses.map((course) => (
                        <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white">
                            <div className="relative overflow-hidden rounded-t-lg">
                                <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <div className="text-white text-center">
                                        <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                                        <p className="text-lg font-semibold">{course.title.split(' - ')[0]}</p>
                                    </div>
                                </div>

                                {/* Featured badge */}
                                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                                    ⭐ Топ
                                </div>

                                {/* Play overlay */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl">
                                        <Play className="w-8 h-8 text-blue-600 ml-1" />
                                    </div>
                                </div>
                            </div>

                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-gray-900 line-clamp-2">
                                    {course.title}
                                </CardTitle>
                                <p className="text-gray-600">Багш: {course.instructor}</p>
                            </CardHeader>

                            <CardContent className="pt-0">
                                {/* Rating and stats */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                        <span className="font-semibold text-gray-900">{course.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{course.students}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{course.duration}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price and CTA */}
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold text-blue-600">{course.price}</div>
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                        Дэлгэрэнгүй
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* View all courses button */}
                <div className="text-center">
                    <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <Link href="/courses">Бүх хичээлүүд</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
