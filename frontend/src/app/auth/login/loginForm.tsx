"use client"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from "react"
import axios from "axios"



export const description =
  "A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account."

export default function LoginForm() {
  const router = useRouter()
  const [userFound,setUserFound] = useState(true)
  const [auth, setAuth] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAuth(prevUser => ({
      ...prevUser,
      [name]: value
    }))
    
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    axios.defaults.headers["Content-Type"] = "application/json"
    axios.defaults.withCredentials = true

    axios.post("http://localhost:8080/api/v1/login",auth).then(res => {

      if(res.data["user"]){

        setUserFound(false)

      }
      else{

        router.push("/dashboard")

      }
 
    }).catch(error => {
      console.log(error);
      console.log('====================================');
    })
  }

  return (
    <Card className="mx-auto w-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
          {!userFound &&
              <h1 className="font-bold">You are not registered. Please register before logging in.</h1>
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              onChange={handleChange}
              placeholder="m@example.com"
              value={auth.email}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              value={auth.password}
              onChange={handleChange}
              placeholder="password"
              required
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="signup" className="underline" >
            Sign Up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}