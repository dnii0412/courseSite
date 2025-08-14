'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Chrome, Facebook, User, Mail } from 'lucide-react'

interface OAuthUserData {
    name: string
    email: string
    provider: string
}

export function OAuthRegisterForm() {
    const { data: session, status } = useSession()
    const [userData, setUserData] = useState<OAuthUserData>({
        name: '',
        email: '',
        provider: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    // Auto-populate form when OAuth session is available
    useEffect(() => {
        if (session?.user && status === 'authenticated') {
            setUserData({
                name: session.user.name || '',
                email: session.user.email || '',
                provider: session.provider || 'unknown'
            })
        }
    }, [session, status])

    // Demo function to show how OAuth data would be populated
    const handleDemoOAuth = (provider: string) => {
        if (provider === 'google') {
            setUserData({
                name: 'John Doe',
                email: 'john.doe@gmail.com',
                provider: 'google'
            })
        } else if (provider === 'facebook') {
            setUserData({
                name: 'Jane Smith',
                email: 'jane.smith@facebook.com',
                provider: 'facebook'
            })
        }
    }

    // Real OAuth sign in function
    const handleRealOAuthSignIn = async (provider: string) => {
        setIsLoading(true)
        try {
            const result = await signIn(provider, {
                callbackUrl: '/auth/register',
                redirect: false
            })

            if (result?.error) {
                toast({
                    title: 'Алдаа гарлаа',
                    description: 'OAuth нэвтрэхэд алдаа гарлаа',
                    variant: 'destructive'
                })
            }
        } catch (error) {
            toast({
                title: 'Алдаа гарлаа',
                description: 'OAuth нэвтрэхэд алдаа гарлаа',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleOAuthSignIn = async (provider: string) => {
        setIsLoading(true)
        try {
            // For now, since OAuth isn't configured, show a message
            toast({
                title: 'OAuth тохиргоо хийгээгүй байна',
                description: 'Google болон Facebook OAuth-ийн тохиргоог хийх хэрэгтэй. Дэлгэрэнгүй мэдээллийг OAUTH_ENV_SETUP.md файлаас харна уу.',
                variant: 'destructive'
            })

            // TODO: Uncomment this when OAuth is properly configured
            // const result = await signIn(provider, {
            //   callbackUrl: '/auth/register',
            //   redirect: false
            // })

            // if (result?.error) {
            //   toast({
            //     title: 'Алдаа гарлаа',
            //     description: 'OAuth нэвтрэхэд алдаа гарлаа',
            //     variant: 'destructive'
            //   })
            // }
        } catch (error) {
            toast({
                title: 'Алдаа гарлаа',
                description: 'OAuth нэвтрэхэд алдаа гарлаа',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!userData.name || !userData.email) {
            toast({
                title: 'Алдаа',
                description: 'Нэр болон имэйл хаягийг бөглөнө үү',
                variant: 'destructive'
            })
            return
        }

        setIsLoading(true)
        try {
            // Here you would typically create the user account
            // For now, we'll just redirect to home
            toast({
                title: 'Амжилттай бүртгэгдлээ',
                description: 'Тавтай морилно уу!'
            })
            router.push('/')
        } catch (error) {
            toast({
                title: 'Алдаа гарлаа',
                description: 'Бүртгэл үүсгэхэд алдаа гарлаа',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        setUserData({ name: '', email: '', provider: '' })
    }

    return (
        <div className="space-y-6">
            {/* OAuth Buttons */}
            <div className="space-y-4">
                <div className="text-center">
                    <h3 className="text-lg font-medium text-[#1B3C53] mb-2">
                        OAuth-ээр бүртгүүлэх
                    </h3>
                    <p className="text-sm text-[#456882]">
                        Google эсвэл Facebook-ээр хурдан бүртгүүлнэ үү
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <Button
                        variant="outline"
                        onClick={() => handleRealOAuthSignIn('google')}
                        disabled={isLoading}
                        className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 transition-colors"
                    >
                        <Chrome className="mr-2 h-4 w-4" />
                        Google-ээр бүртгүүлэх
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => handleDemoOAuth('facebook')}
                        disabled={isLoading}
                        className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white border-[#1877F2] hover:border-[#1877F2] transition-colors"
                    >
                        <Facebook className="mr-2 h-4 w-4" />
                        Facebook-ээр бүртгүүлэх (Demo)
                    </Button>
                </div>
            </div>

            {/* OAuth User Data Form */}
            {session?.user && (
                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">
                                Таны мэдээлэл
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="oauth-name" className="text-[#1B3C53] font-medium">
                                Нэр
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#456882]" />
                                <Input
                                    id="oauth-name"
                                    type="text"
                                    value={userData.name}
                                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                    placeholder="Таны нэр"
                                    className="border-[#D2C1B6] focus:border-[#456882] focus:ring-[#456882] text-[#1B3C53] placeholder:text-[#456882]/60 pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="oauth-email" className="text-[#1B3C53] font-medium">
                                И-мэйл хаяг
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#456882]" />
                                <Input
                                    id="oauth-email"
                                    type="email"
                                    value={userData.email}
                                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                    placeholder="your@email.com"
                                    className="border-[#D2C1B6] focus:border-[#456882] focus:ring-[#456882] text-[#1B3C53] placeholder:text-[#456882]/60 pl-10"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                className="flex-1 bg-[#456882] hover:bg-[#1B3C53] text-white transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Бүртгүүлж байна...' : 'Бүртгүүлэх'}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSignOut}
                                className="px-6 border-[#D2C1B6] text-[#456882] hover:bg-[#F9F3EF]"
                            >
                                Буцах
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
