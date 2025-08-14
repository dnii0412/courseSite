import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-[#F9F3EF] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1B3C53] mb-2">
            Welcome back, {session.user?.name || 'User'}!
          </h1>
          <p className="text-[#456882]">
            You're successfully signed in with Google OAuth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white border-[#D2C1B6] shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1B3C53]">Account Info</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium text-[#456882]">Name:</span>
                <span className="ml-2 text-[#1B3C53]">{session.user?.name}</span>
              </div>
              <div>
                <span className="font-medium text-[#456882]">Email:</span>
                <span className="ml-2 text-[#1B3C53]">{session.user?.email}</span>
              </div>
              <div>
                <span className="font-medium text-[#456882]">Role:</span>
                <span className="ml-2 text-[#1B3C53]">{session.user?.role || 'USER'}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#D2C1B6] shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1B3C53]">Authentication</CardTitle>
              <CardDescription>OAuth provider details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-[#456882]">Signed in with Google</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#D2C1B6] shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1B3C53]">Quick Actions</CardTitle>
              <CardDescription>What would you like to do?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button className="w-full text-left p-2 rounded hover:bg-[#F9F3EF] text-[#456882] transition-colors">
                  View Courses
                </button>
                <button className="w-full text-left p-2 rounded hover:bg-[#F9F3EF] text-[#456882] transition-colors">
                  Update Profile
                </button>
                <button className="w-full text-left p-2 rounded hover:bg-[#F9F3EF] text-[#456882] transition-colors">
                  Settings
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
