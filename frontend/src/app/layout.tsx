import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './presentation/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mon Site',
  description: 'Bienvenue sur mon site avec une présentation et une application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <header>
          {/* Ajoutez votre en-tête ici */}
        </header>
        <main>{children}</main>
        <footer>
          {/* Ajoutez votre pied de page ici */}
        </footer>
      </body>
    </html>
  )
}