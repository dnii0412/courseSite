import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9F3EF]">
            <Card className="w-full max-w-md bg-white border-[#D2C1B6] shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl text-[#1B3C53]">Authentication Error</CardTitle>
                    <CardDescription className="text-[#456882]">
                        Something went wrong during authentication
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-[#456882] text-center">
                        We encountered an error while trying to sign you in. This could be due to:
                    </p>
                    <ul className="text-sm text-[#456882] space-y-1 list-disc list-inside">
                        <li>Invalid or expired OAuth credentials</li>
                        <li>Network connectivity issues</li>
                        <li>Server configuration problems</li>
                    </ul>

                    <div className="space-y-3 pt-4">
                        <Button asChild className="w-full">
                            <Link href="/auth/login">
                                Try Again
                            </Link>
                        </Button>

                        <Button variant="outline" asChild className="w-full">
                            <Link href="/">
                                Go Home
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
