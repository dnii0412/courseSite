// Client-side configuration for OAuth providers
// This file safely exposes which OAuth providers are available

export const clientConfig = {
  oauth: {
    google: {
      enabled: false, // Will be updated by fetchOAuthProviders
      clientId: '',
    },
    facebook: {
      enabled: false, // Will be updated by fetchOAuthProviders
      clientId: '',
    },
  },
  app: {
    name: 'New Era',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
}

// Function to fetch OAuth provider availability from server
export async function fetchOAuthProviders() {
  try {
    const response = await fetch('/api/auth/providers')
    if (response.ok) {
      const providers = await response.json()
      clientConfig.oauth.google.enabled = providers.google.enabled
      clientConfig.oauth.facebook.enabled = providers.facebook.enabled
      return providers
    }
  } catch (error) {
    console.error('Failed to fetch OAuth providers:', error)
  }
  return { google: { enabled: false }, facebook: { enabled: false } }
}
