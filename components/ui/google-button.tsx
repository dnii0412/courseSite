import { Button } from "@/components/ui/button"

export function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.31 0-6-2.7-6-6s2.69-6 6-6c1.89 0 3.17.8 3.9 1.5l2.66-2.56C16.85 3.2 14.6 2.3 12 2.3 6.98 2.3 2.9 6.38 2.9 11.4s4.08 9.1 9.1 9.1c5.26 0 8.72-3.7 8.72-8.9 0-.6-.06-1.02-.14-1.48H12z"/>
    </svg>
  )
}

export function GoogleButton({ onClick, children="Google Login" }: { onClick?: () => void; children?: React.ReactNode; }) {
  return (
    <Button onClick={onClick} variant="outline" className="group w-full h-10 gap-2 border rounded-xl hover:shadow-soft transition-all">
      <GoogleIcon className="h-5 w-5" />
      <span className="tracking-wide">{children}</span>
    </Button>
  )
}
