"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Clock, CalendarDays, Users } from "lucide-react"
import axios from "axios"
import { useParams } from "next/navigation" // Importez useParams

interface Task {
  id: string
  name: string
  status?: string 
}

interface Team {
  id: string
  name: string
}

interface Owner {
  id: string
  firstName: string
  avatar?: string
}

interface Project {
  id: string
  name: string
  description: string
  tasks?: Task[] 
  teams?: Team[] 
  owner: Owner
  startDate: Date | string 
  endDate: Date | string 
}

export default function ProjectPage() {
  const params = useParams() 
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get<Project>(`http://localhost:8080/api/v1/project/${projectId}`)
        console.log(response.data)

        const projectData = {
          ...response.data,
          startDate: new Date(response.data.startDate),
          endDate: new Date(response.data.endDate),
        }

        setProject(projectData)
        setLoading(false)
      } catch (err) {
        setError("Une erreur est survenue lors du chargement des données du projet.")
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  if (loading) {
    return <div className="container mx-auto py-8 text-center">Chargement...</div>
  }

  if (error) {
    return <div className="container mx-auto py-8 text-center text-red-500">{error}</div>
  }

  if (!project) {
    return <div className="container mx-auto py-8 text-center">Projet non trouvé</div>
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground mt-2">{project.description}</p>
        </div>

        <Separator />

        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={project.owner.avatar} alt={project.owner.firstName} />
            <AvatarFallback>{project.owner.firstName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{project.owner.firstName}</p>
            <p className="text-sm text-muted-foreground">Propriétaire du projet</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
              <CalendarDays className="w-4 h-4" />
              <CardTitle className="text-base">Dates du projet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Début :</span>
                  <span className="text-sm font-medium">
                    {format(new Date(project.startDate), "PP", { locale: fr })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fin :</span>
                  <span className="text-sm font-medium">
                    {format(new Date(project.endDate), "PP", { locale: fr })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
              <Users className="w-4 h-4" />
              <CardTitle className="text-base">Équipes</CardTitle>
            </CardHeader>
            <CardContent>
              {project.teams && project.teams.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.teams.map((team) => (
                    <Badge key={team.id} variant="secondary">
                      {team.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune équipe assignée</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <CardTitle className="text-base">Tâches</CardTitle>
          </CardHeader>
          <CardContent>
            {project.tasks && project.tasks.length > 0 ? (
              <ul className="space-y-2">
                {project.tasks.map((task) => (
                  <li key={task.id} className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{task.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune tâche pour le moment</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}