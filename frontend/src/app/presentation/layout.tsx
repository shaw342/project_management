import React from "react"
import { Inter } from 'next/font/google'
import './presentation.css'
import Navbar from './navbar'

import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
const inter = Inter({ subsets: ['latin'] })

export default function AppLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      /*<SidebarProvider>
        <MainSidebar/>
      <main className=" w-[100%]">
      <SidebarTrigger />
        {children}
      </main><Profile />
      </SidebarProvider>*/
      <body className={inter.className}>
        <header>
          {/* Ajoutez votre en-tête ici */}
          <Navbar/>
        </header>
      <main>
        {children}
      </main>
        <footer>
          {/* Ajoutez votre pied de page ici */}
        </footer>
      </body>
  
    )
  }