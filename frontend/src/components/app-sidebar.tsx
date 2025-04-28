import {Hourglass,Calendar, Home, Inbox, Search, Settings,ListTodo, ChevronUp, User2,NotebookPen, MessageCircle,FolderRoot, icons,Settings2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarRail,
  SidebarGroupContent,
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
    url: `/dashboard/tasks`,
    icon: ListTodo,
  },
  {
    title: "Notes",
    url:"/dashboard/notes",
    icon: NotebookPen,

  },
  {
    title:"Teams",
    url:"/dashboard/team",
    icon: RiTeamLine
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


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <span className="text-base font-semibold">LOGO</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="flex justify-center">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
      <SidebarMenuButton><Settings size={48}/></SidebarMenuButton>       
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
