"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { User, Mail, Lock } from 'lucide-react'

export default function SignInForm() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Données du formulaire:', user)
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Créer un compte</CardTitle>
        <CardDescription className="text-center">
          Entrez vos informations pour vous inscrire
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <div className="relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={user.firstName}
                  onChange={handleChange}
                  className="pl-8"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <div className="relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={user.lastName}
                  onChange={handleChange}
                  className="pl-8"
                  required
                />
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={user.email}
                onChange={handleChange}
                className="pl-8"
                required
              />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={user.password}
                onChange={handleChange}
                className="pl-8"
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full bg-slate-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          onClick={handleSubmit}
        >
          S'inscrire
        </Button>
      </CardFooter>
    </Card>
  )
}
