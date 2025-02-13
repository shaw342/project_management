"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "../../src/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageSquare } from "lucide-react"
import axios from "axios"


const initialTeams = [
  {
    id: 1,
    name: "Équipe Alpha",
    staffs: [
      {
        id: 1,
        name: "Alice Dubois",
        email: "alice@example.com",
        role: "Chef d'équipe",
        task: "Planification du sprint",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        name: "Bob Martin",
        email: "bob@example.com",
        role: "Développeur",
        task: "Implémentation de l'API",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    id: 2,
    name: "Équipe Beta",
    staffs: [
      {
        id: 3,
        name: "Charlie Dupont",
        email: "charlie@example.com",
        role: "Designer",
        task: "Maquettes de l'interface",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 4,
        name: "Diana Lefebvre",
        email: "diana@example.com",
        role: "Chef de projet",
        task: "Coordination avec le client",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
]

export default function TeamManagementPage() {
  const [teams, setTeams] = useState(initialTeams)
  const [teamName, setTeamName] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null)
  const [inviteEmail, setInviteEmail] = useState("")

  useEffect(() => {

    const fetchData = async () => {
      
    }
  },[])

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault()
    if (teamName.trim() === "") {
      toast({ title: "Erreur", description: "Le nom de l'équipe ne peut pas être vide.", variant: "destructive" })
      return
    }

    const newTeam = {
      id: teams.length + 1,
      name: teamName,
      staffs: [],
    }
    axios.post("http://localhost:8080/api/v1/team/create",newTeam)
    .then(res =>{
      console.log(res.data);
      setTeams(res.data)
      
    }).catch(error =>{
      console.log(error);
      
    })

    setTeams([...teams, newTeam])
    toast({
      title: "Équipe créée",
      description: `L'équipe "${teamName}" a été créée avec succès.`,
    })
    setTeamName("")
  }

  const handleDeleteTeam = (teamId: number) => {
    setTeams(teams.filter((team) => team.id !== teamId))
    toast({
      title: "Équipe supprimée",
      description: "L'équipe a été supprimée avec succès.",
    })
    if (selectedTeam === teamId) {
      setSelectedTeam(null)
    }
  }

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeam) {
      toast({ title: "Erreur", description: "Veuillez sélectionner une équipe.", variant: "destructive" })
      return
    }
    if (!inviteEmail.trim()) {
      toast({ title: "Erreur", description: "L'adresse e-mail ne peut pas être vide.", variant: "destructive" })
      return
    }

    toast({
      title: "Invitation envoyée",
      description: `Une invitation a été envoyée à ${inviteEmail}.`,
    })
    setInviteEmail("")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Gestion des équipes</h1>
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Liste des équipes</TabsTrigger>
          <TabsTrigger value="create">Créer une équipe</TabsTrigger>
          <TabsTrigger value="invite">Inviter un membre</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          {teams.map((team) => (
            <Card key={team.id} className="mb-6">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{team.name}</span>
                  <Button variant="destructive" onClick={() => handleDeleteTeam(team.id)}>
                    Supprimer l'équipe
                  </Button>
                </CardTitle>
                <CardDescription>Membres de l'équipe et leurs tâches actuelles</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Avatar</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Tâche actuelle</TableHead>
                      <TableHead className="text-right">Chat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {team.staffs.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{member.task}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Chatter
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Chat avec {member.name}</DialogTitle>
                                <DialogDescription>
                                  Cette fonctionnalité de chat n'est pas encore implémentée.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mt-4">
                                <p>Ici, vous pourriez implémenter une interface de chat en temps réel.</p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Créer une nouvelle équipe</CardTitle>
              <CardDescription>Donnez un nom à votre nouvelle équipe</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTeam}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="teamName">Nom de l'équipe</Label>
                    <Input
                      id="teamName"
                      placeholder="Entrez le nom de l'équipe"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateTeam}>Créer l'équipe</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="invite">
          <Card>
            <CardHeader>
              <CardTitle>Inviter un nouveau membre</CardTitle>
              <CardDescription>Envoyez une invitation à rejoindre l'équipe</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInviteMember}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="teamSelect">Équipe</Label>
                    <Select onValueChange={(value) => setSelectedTeam(Number(value))}>
                      <SelectTrigger id="teamSelect">
                        <SelectValue placeholder="Sélectionnez une équipe" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id.toString()}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="inviteEmail">Adresse e-mail</Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      placeholder="Entrez l'adresse e-mail"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button onClick={handleInviteMember}>Envoyer l'invitation</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}