import { Calendar, Home, Inbox, Search, Settings,FolderRoot,Settings2 } from "lucide-react"
 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SidebarFooter } from "@/components/ui/sidebar"
import Profile from "./profile"
import { SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar"
 
// Menu items.
const items = [
  {
    title: "Home",
    url: "app/dashboard",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Project",
    url: "#",
    icon: FolderRoot,
  },
]

const setting = 
    {
        title: "Settings",
        url: "#",
        icon: Settings,
      }

export function MainSidebar() {

    return (
      <Sidebar collapsible="icon" >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Settings2/>    
        </SidebarFooter>
      </Sidebar>
    )
  }
  
  