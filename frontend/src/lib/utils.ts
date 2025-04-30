import axios from "axios"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface Task {
  id: string
  title: string
  description: string
  date: string 
  status: 'todo' | 'in-progress' | 'done'
}

export interface Project{
  id: string,
  name: string,
}


export async function fetchTasks(): Promise<Task[]> {
  const task:Task ={
    id: "",
    title: "",
    description: "",
    date: "",
    status: "todo"
  }

  try {
    const response =  await axios.get("https://jsonplaceholder.typicode.com/posts/1")
    task.title = response.data["title"]
    
  } catch (error) {
    console.log(error);
    
  }
  return [
    { id: '1', title: task.title, description: 'Réunion hebdomadaire', date: '2025-05-28T10:00:00Z', status: 'todo' },
    { id: '2', title: 'Présentation projet', description: 'Présenter le nouveau projet', date: '2025-01-16T14:30:00Z', status: 'in-progress' },
    { id: '3', title: 'Révision code', description: 'Revoir le code du sprint', date: '2025-01-17T09:00:00Z', status: 'done' },
  ]
}

export  async function name(params:type) {
  const project:Project =[]
  try {

    const response = await axios.get("http://localhost:8080/api/v1/project/get/all")
    

  } catch (error) {
    console.log(error);
    
  }
}
