import {Hourglass,Calendar, Home, Inbox, Search, Settings,ListTodo, ChevronUp, User2,NotebookPen, MessageCircle,FolderRoot, icons } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { RiTeamLine } from "react-icons/ri";
import { title } from "process";
import { url } from "inspector";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "/dashboard/inbox",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Projects",
    url:"/dashboard/project",
    icon:FolderRoot,
  },
  {
    title: "Task",
    url: `/dashboard/project/tasks`,
    icon: ListTodo,
  },
  {
    title: "Notes",
    url:"#",
    icon: NotebookPen,

  },
  {
    title:"Teams",
    url:"/dashboard/team",
    icon:RiTeamLine
  },
  {
    title:"Chat",
    url:"/dashboard/chat",
    icon:MessageCircle
  },
  {
    title:"TimeBox",
    url:"/dashboard/timebox",
    icon:Hourglass
  }
]


export function AppSidebar() {
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
  
    </Sidebar>
  )
}
