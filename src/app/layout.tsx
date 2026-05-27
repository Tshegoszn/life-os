import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/sidebar'

export const metadata: Metadata = {
  title: 'Life OS',
  description: 'Your personal life operating system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen" style={{ background: '#FFF7FB' }}>
          <Sidebar />
          <main
            className="flex-1 min-h-screen"
            style={{ marginLeft: '64px' }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}