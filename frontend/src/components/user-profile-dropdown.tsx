"use client"

import { useState,useEffect } from "react"
import { getCookie } from "cookies-next/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import useSWR from "swr"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, ChevronDown } from 'lucide-react'
import axios from "axios"



interface User {
  firstName: string
  lastName: string
  email: string
  avatarUrl: string
}

const initialUser: User = {
  firstName: "",
  lastName: "",
  email: "",
  avatarUrl: "",
}

export default function UserProfileDropdown() {
  const router = useRouter()

  const [user, setUser] = useState<User>(initialUser)

  const fetcher = (url: string) =>
    axios.get(url).then((res) => res.data)

  axios.defaults.withCredentials = true

  const { data, error, isLoading } = useSWR<User>(
    "http://localhost:8080/api/v1/welcome",
    fetcher
  )

  useEffect(() => {
    if (data) {
      setUser(data)
    }
  }, [data])

  useEffect(() => {
    if (error?.response?.status === 401) {
      router.push("/");
    }
  }, [error, router]);

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!data) {
    return <div>No data available.</div>
  }

  const handleLogout = async () => {
    try {

      const response = await axios.post("http://localhost:8080/api/v1/logout")


      router.push("/")
      console.log("Logged out successfully")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 rounded-full flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl} alt={user.firstName} />
            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
          </Avatar>
          <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

