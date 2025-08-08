'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

const recentEnrollments = [
  {
    id: 1,
    studentName: 'Бат-Эрдэнэ',
    studentEmail: 'bat-erdene@example.com',
    courseName: 'React.js сургалт',
    enrollmentDate: '2024-01-15',
    status: 'active',
    avatar: '/placeholder-user.jpg'
  },
  {
    id: 2,
    studentName: 'Сүхээ',
    studentEmail: 'sukhee@example.com',
    courseName: 'Node.js сургалт',
    enrollmentDate: '2024-01-14',
    status: 'active',
    avatar: '/placeholder-user.jpg'
  },
  {
    id: 3,
    studentName: 'Оюунчимэг',
    studentEmail: 'oyunchimeg@example.com',
    courseName: 'Python сургалт',
    enrollmentDate: '2024-01-13',
    status: 'pending',
    avatar: '/placeholder-user.jpg'
  },
  {
    id: 4,
    studentName: 'Мөнхбат',
    studentEmail: 'monkhbat@example.com',
    courseName: 'JavaScript сургалт',
    enrollmentDate: '2024-01-12',
    status: 'completed',
    avatar: '/placeholder-user.jpg'
  },
  {
    id: 5,
    studentName: 'Алтанцэцэг',
    studentEmail: 'altantsetseg@example.com',
    courseName: 'TypeScript сургалт',
    enrollmentDate: '2024-01-11',
    status: 'active',
    avatar: '/placeholder-user.jpg'
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800">Идэвхтэй</Badge>
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800">Хүлээгдэж буй</Badge>
    case 'completed':
      return <Badge className="bg-blue-100 text-blue-800">Дууссан</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function RecentEnrollments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Сүүлийн элсэлтүүд</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentEnrollments.map((enrollment) => (
            <div key={enrollment.id} className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={enrollment.avatar} alt={enrollment.studentName} />
                <AvatarFallback>
                  {enrollment.studentName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {enrollment.studentName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {enrollment.courseName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {enrollment.studentEmail}
                </p>
              </div>
              
              <div className="flex flex-col items-end space-y-1">
                {getStatusBadge(enrollment.status)}
                <p className="text-xs text-muted-foreground">
                  {formatDate(enrollment.enrollmentDate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
