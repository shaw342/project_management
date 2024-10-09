"use client"

import { useState } from "react"
import { Menu, X, Home, Settings, HelpCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Dashboard from "./dashbord";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <div className="relative min-h-screen">
      {/* Hamburger button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-background shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-4 space-y-4 mt-16">
          <Button variant="ghost" className="justify-start">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" className="justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="ghost" className="justify-start">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help
          </Button>
          <Button variant="ghost" className="justify-start text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900 dark:hover:text-red-300">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>

      {/* Main content */}
      <main>
      <Dashboard />
      </main>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  )
}