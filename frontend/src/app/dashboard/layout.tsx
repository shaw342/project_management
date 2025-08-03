import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import UserProfileDropdown  from "@/components/user-profile-dropdown";
import { NotificationBell } from "@/components/notification-bell";
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-[90%]">
        <SidebarTrigger />
        {children}
      </main>
      <div className="h-[150px] flex justify-evenly items-center flex-col">
         <UserProfileDropdown/> 
         <NotificationBell/>
      </div>
    </SidebarProvider>
  )
}