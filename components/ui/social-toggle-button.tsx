"use client"

import { useState } from 'react'
import { Facebook, Instagram, MessageCircle, X, Share2 } from 'lucide-react'
import Link from 'next/link'

export function SocialToggleButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const socialLinks = [
        {
            name: 'Facebook',
            icon: Facebook,
            href: '#',
            color: 'hover:bg-blue-600',
            iconColor: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20'
        },
        {
            name: 'Instagram',
            icon: Instagram,
            href: '#',
            color: 'hover:bg-pink-600',
            iconColor: 'text-pink-500',
            bgColor: 'bg-pink-500/10',
            borderColor: 'border-pink-500/20'
        },
        {
            name: 'Telegram',
            icon: MessageCircle,
            href: '#',
            color: 'hover:bg-blue-500',
            iconColor: 'text-blue-400',
            bgColor: 'bg-blue-400/10',
            borderColor: 'border-blue-400/20'
        }
    ]

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Social Links */}
            <div className={`mb-4 space-y-3 transition-all duration-500 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                {socialLinks.map((social, index) => (
                    <div
                        key={social.name}
                        className={`transform transition-all duration-700 ease-out ${isOpen
                                ? 'translate-y-0 opacity-100 scale-100 rotate-0'
                                : 'translate-y-8 opacity-0 scale-75 rotate-12'
                            }`}
                        style={{
                            transitionDelay: `${index * 150}ms`
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <Link
                            href={social.href}
                            className={`group relative w-14 h-14 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-500 ease-out hover:scale-125 hover:shadow-2xl border-2 ${social.borderColor} hover:border-opacity-100`}
                            title={social.name}
                        >
                            {/* Background glow effect */}
                            <div className={`absolute inset-0 rounded-full ${social.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm scale-150`} />

                            {/* Icon with smooth color transition */}
                            <social.icon className={`w-7 h-7 ${social.iconColor} transition-all duration-500 group-hover:scale-110 ${hoveredIndex === index ? 'animate-pulse' : ''
                                }`} />

                            {/* Ripple effect on click */}
                            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-active:opacity-100 group-active:scale-150 transition-all duration-300" />
                        </Link>
                    </div>
                ))}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl ${isOpen ? 'rotate-45' : 'rotate-0'
                    }`}
                title={isOpen ? 'Close social links' : 'Open social links'}
            >
                {isOpen ? (
                    <X className="w-7 h-7 text-white" />
                    
                ) : (

                    <Share2 className="w-7 h-7 text-white" />
                )}
            </button>
        </div>
    )
}
