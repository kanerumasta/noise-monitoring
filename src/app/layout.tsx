
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Toaster } from 'react-hot-toast'

import NoiseNotificationListener from '@/components/NotificationsListener'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Noise Monitoring System',
  description: 'Real-time noise monitoring system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <NoiseNotificationListener />
        <Toaster position="top-right" />
       {children}
      </body>
    </html>
  )
}
