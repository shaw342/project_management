"use client"
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, UsersIcon, CheckSquareIcon, Trash2Icon, EditIcon } from 'lucide-react'
import { Project } from '@/components/types/project'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next/client'

import useSWR from 'swr'
import { log } from 'console'

interface ProjectListProps {
  projects: Project[];
  onDeleteProject: (id: string) => void;
  onEditProject: (project: Project) => void;
}

export function ProjectList({ onDeleteProject, onEditProject }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([])

  const [token,setToken] = useState("")

  useEffect(() => {
    const cookieToken = getCookie("token") as string | undefined;
    
    if (cookieToken) {
      setToken(cookieToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${cookieToken}`;
    }
  }, []);



  axios.get("http://localhost:8080/api/v1/all/projects").then(res =>{
    console.log(res.data)
    if (res.data["tasks"] == undefined){
      res.data["tasks"] = []
    }
    
    setProjects(res.data)
  }).catch(error =>{
    console.log('====================================');
    console.log(error);
    console.log('====================================');
  })

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">{project.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                <span>
                  {project.startDate && project.endDate
                    ? `Du ${project.startDate} au ${project.endDate}`
                    : "Dates non définies"}
                </span>
              </div>
              <div className="flex items-center">
                <UsersIcon className="mr-2 h-4 w-4 opacity-70" />
                <span>{project.owner.name}</span>
              </div>
              <div className="flex items-center">
                <CheckSquareIcon className="mr-2 h-4 w-4 opacity-70" />
                <span>{project.tasks ? project.tasks.length : 0} tâches</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/projects/${project.id}`} passHref>
              <Button variant="outline">Voir les détails</Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onEditProject(project)}>
                <EditIcon className="h-4 w-4" />
              </Button>
              <Button variant="destructive" onClick={() => onDeleteProject(project.id)}>
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

