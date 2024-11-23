import React from "react"
import { MainSidebar } from "./sidebar";
import { Inter } from 'next/font/google'
import './global.css'
import Profile from "./profile";
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
        </header>
        <SidebarProvider>
        <MainSidebar/>
      <main className=" w-[100%]">
      <SidebarTrigger />
        {children}
      </main><Profile />
      </SidebarProvider>
        <footer>
          {/* Ajoutez votre pied de page ici */}
        </footer>
      </body>
  
    )
  }