"use client"

import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CalendarIcon, UsersIcon, CheckSquareIcon, ClockIcon } from 'lucide-react'
import { Project, Task } from '@/components/types'
import axios from 'axios'
import { log } from 'console'

// Simulation de données. Dans une vraie application, vous feriez un appel API ici.
const getProject = (id: string): Project | undefined => {

    axios.get(`http://localhost:8080/api/v1/${id}`).then(res => {
        console.log('====================================');
        console.log(res.data);
        console.log('====================================');
    }).catch(error =>{
        console.log('====================================');
        console.log(error);
        console.log('====================================');
    })

    
  const projects: Project[] = [
    {
      id: "1",
      name: "Lancement de l'application mobile EcoTrack",
      description: "Développement et lancement d'une application mobile pour aider les utilisateurs à suivre et réduire leur empreinte carbone au quotidien.",
      owner: { id: "1", name: "Sophie Martin" ,email:"rzknfrozg@fvn"},
      tasks: [
        { id: "1", title: "Analyse de marché et définition des fonctionnalités", status: "completed" },
        { id: "2", title: "Design UX/UI de l'application", status: "completed" },
        { id: "3", title: "Développement du backend", status: "in-progress" },
        { id: "4", title: "Développement du frontend mobile", status: "in-progress" },
        { id: "5", title: "Intégration des API de calcul d'empreinte carbone", status: "not-started" },
        { id: "6", title: "Tests utilisateurs", status: "not-started" },
      ],
      teams: [
        { id: "1", name: "Équipe Produit" },
        { id: "2", name: "Équipe Design" },
        { id: "3", name: "Équipe Développement" },
        { id: "4", name: "Équipe QA" }
      ],
      startDate: "2023-03-15",
      endDate: "2023-09-30"
    },
  ];

  return projects.find(p => p.id === id);
};

const TaskStatus = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status === 'completed' ? 'Terminé' : status === 'in-progress' ? 'En cours' : 'Non commencé'}
    </span>
  );
};

export default function ProjectDetails() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const project = getProject(projectId);

  if (!project) {
    return <div className="container mx-auto py-8 text-center">Projet non trouvé</div>;
  }

  const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
  const progress = (completedTasks / project.tasks.length) * 100;

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        Retour à la liste
      </Button>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold">{project.name}</CardTitle>
              <p className="text-gray-500 mt-2">{project.description}</p>
            </div>
            <Badge variant="secondary" className="text-lg">
              {Math.round(progress)}% Complété
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={progress} className="w-full h-2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-sm">
                Du {new Date(project.startDate).toLocaleDateString()} au {new Date(project.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <UsersIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-sm">Chef de projet : {project.owner.name}</span>
            </div>
            <div className="flex items-center">
              <CheckSquareIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-sm">{project.tasks.length} tâches au total</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-sm">
                {Math.round((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jours restants
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-3">Équipes impliquées</h3>
            <div className="flex flex-wrap gap-2">
              {project.teams.map(team => (
                <Badge key={team.id} variant="outline">{team.name}</Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-3">Tâches</h3>
            <ul className="space-y-3">
              {project.tasks.map(task => (
                <li key={task.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="flex items-center">
                    <CheckSquareIcon className="mr-2 h-4 w-4 opacity-70" />
                    {task.title}
                  </span>
                  <TaskStatus status={task.status} />
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

