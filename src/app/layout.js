'use client'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Next.js App',
//   description: 'A simple Next.js app with login, user management, and dashboard',
// }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

