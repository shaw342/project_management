import { Calendar, Home, Inbox, Search, Settings,ListTodo, ChevronUp, User2,NotebookPen, MessageCircle } from "lucide-react"

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

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
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
    title: "Task",
    url: "/dashboard/tasks",
    icon: ListTodo,
  },
  {
    title: "Notes",
    url:"#",
    icon: NotebookPen,

  },
  {
    title:"Teams",
    url:"#",
    icon:RiTeamLine
  },
  {
    title:"Chat",
    url:"#",
    icon:MessageCircle
  }
]

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
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
