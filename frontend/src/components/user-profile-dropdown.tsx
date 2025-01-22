"use client"

import * as React from "react"
import { useState,useEffect } from "react"
import { getCookie } from "cookies-next/client"
import { Button } from "@/components/ui/button"
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

// Mock user data
const user = {
  firstName: "",
  lastName:"",
  email: "",
  avatarUrl: "",
}

export default function UserProfileDropdown() {
  const [token, setToken] = useState<string | undefined>();

  useEffect(() => {
    const cookieToken = getCookie("token") as string | undefined;
    if (cookieToken) {
      setToken(cookieToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${cookieToken}`;
    }
  }, []);

  const fetcher = (url: string) =>
    axios.get(url).then((res) => res.data);

  const { data, error, isLoading } = useSWR(
    token ? "http://localhost:8080/api/v1/welcome" : null, 
    fetcher
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error : {error.message}</div>;
  }

  if (!data) {
    return <div>No data available.</div>;
  }

  user.email = data.Email
  user.firstName = data.FirstName
  
  const handleLogout = () => {
    // Placeholder for logout functionality
    console.log("Logging out...")
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
            <p className="text-sm font-medium leading-none">{user.firstName}</p>
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

