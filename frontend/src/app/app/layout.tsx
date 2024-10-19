import React from "react"
import SidebarLeft  from "../../components/sidebar-left";
import './global.css'
import Profile from "./profile";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";

export default function AppLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <SidebarProvider>
      <SidebarLeft />
      <main className="bg-zinc-300 w-[100%]">
        <SidebarTrigger />
        {children}
      </main>
      <Profile/>
      
    </SidebarProvider>
    )
  }