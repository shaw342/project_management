"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import TeamInvitationForm from "@/components/team-invitation-form"
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
import { id } from "date-fns/locale"
import { getCookie } from "cookies-next"
import { UUID } from "crypto"


interface User{
  id:number,
  firstName:string,
  lastName:string,
  email:string,
  task?:string,
  avatar?:string,
}

interface Teams {
  id:number,
  name:string,
  members?:User[],

}


export default function TeamManagementPage() {
  const [teams, setTeams] = useState<Teams[]>([])
  const [teamName, setTeamName] = useState("")
  const [teamId,SetTeamId] = useState()
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null)
  const [inviteEmail, setInviteEmail] = useState("")
  const [token,setToken] = useState<string | undefined>()



  useEffect(() => {
    const cookieToken = getCookie("access_token") as string | undefined;
    if (cookieToken) {
      setToken(cookieToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${cookieToken}`;
      axios.defaults.headers.common["Content-Type"] = "application/json"
      
      const FetchTeams = async () => {

        try {
           const response = await axios.get("http://localhost:8080/api/v1/user/team/all")

           console.log('====================================');
           console.log(response.data);
           console.log('====================================');

          setTeams(response.data) 
        } catch (error) {
          console.log(error);
        }
      }
      
      FetchTeams()
      teams.push()
    }
  }, []);

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault()
    if (teamName.trim() === "") {
      toast({ title: "Erreur", description: "Le nom de l'équipe ne peut pas être vide.", variant: "destructive" })
      return
    }
    const newTeam = {
      id: teams.length + 1,
      name: teamName,
      members: [],
    }

    console.log('====================================');
    console.log(token);
    console.log('====================================');

    const playLoad = {
      id:newTeam.id.toString(),
      name:teamName,
      
    }

    try {
      const response = axios.post("http://localhost:8080/api/v1/user/team/create",playLoad,{
        headers:{
          "Content-Type":"application/json",
        }
      })

      console.log('====================================');
      console.log(response);
      console.log('====================================');
      setTeams([...teams, newTeam])
      toast({
        title: "Équipe créée",
        description: `L'équipe "${teamName}" a été créée avec succès.`,
      })
  
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      setTeamName("")

    }

  }

  const handleDeleteTeam = (teamId: number) => {

    try {
      const Delete = axios.post("http://localhost:8080/api/v1/team/delete")
      setTeams(teams.filter((team) => team.id !== teamId))
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }

    toast({
      title: "Équipe supprimée",
      description: "L'équipe a été supprimée avec succès.",
    })
    if (selectedTeam === teamId) {
      setSelectedTeam(null)
    }
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
                    {team.members?.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src={member.avatar} alt={member.firstName} />
                            <AvatarFallback>
                              {member.firstName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>{member.firstName} {member.lastName}</TableCell>
                        <TableCell>{member.email}</TableCell>
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
                                <DialogTitle>Chat avec {member.firstName} {member.lastName}</DialogTitle>
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
          <TeamInvitationForm token={token}/>
        </TabsContent>
      </Tabs>
    </div>
  )
}
