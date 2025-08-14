"use client"


export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || '/courses'

  useEffect(() => {
    // Fetch OAuth provider availability from server
    const fetchProviders = async () => {
      try {
        const response = await fetch('/api/auth/providers')
        if (response.ok) {
          const providers = await response.json()
          const availableProviders = []
          if (providers.google.enabled) availableProviders.push('google')
          if (providers.facebook.enabled) availableProviders.push('facebook')
          setOauthProviders(availableProviders)
        }
      } catch (error) {
        console.error('Failed to fetch OAuth providers:', error)
      }
    }

    fetchProviders()
  }, [])

  // Redirect if already logged in
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (session?.user) {
    router.push('/courses')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = (provider: 'google' | 'facebook') => {
    signIn(provider, { 
      callbackUrl: returnUrl
    })
  }

  return (
  )
}
