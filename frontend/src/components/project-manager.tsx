"use client"

import { useState } from "react"
import { format, parse, isValid } from "date-fns"
import { Plus, Pencil, Trash2, Users, Calendar, DollarSign } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Project } from "@/components/types/project"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    name: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: "Not Started",
    manager: "",


  })
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newTeamMember, setNewTeamMember] = useState("")

  const addProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (newProject.name.trim() && newProject.manager.trim()) {
      setProjects([...projects, { ...newProject, id: Date.now().toString() }])
      setNewProject({
        name: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "Not Started",
        manager: "",
      })
    }
  }

  const deleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id))
  }

  const handleDateChange = (field: "startDate" | "endDate", value: string, isEditing = false) => {
    const date = parse(value, "yyyy-MM-dd", new Date())
    if (isValid(date)) {
      if (isEditing && editingProject) {
        setEditingProject({ ...editingProject, [field]: date })
      } else {
        setNewProject({ ...newProject, [field]: date })
      }
    }
  }

  

  const startEditing = (project: Project) => {
    setEditingProject(project)
    setIsEditDialogOpen(true)
  }

  const saveEditedProject = () => {
    if (editingProject) {
      setProjects(projects.map((project) => (project.id === editingProject.id ? editingProject : project)))
      setIsEditDialogOpen(false)
      setEditingProject(null)
    }
  }

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "Not Started":
        return "bg-gray-100 text-gray-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "On Hold":
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="list">Projects List</TabsTrigger>
        <TabsTrigger value="create">Create Project</TabsTrigger>
      </TabsList>

      <TabsContent value="list">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {format(project.startDate, "PP")} - {format(project.endDate, "PP")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">Manager: {project.manager}</span>
                  
                    <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => startEditing(project)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteProject(project.id)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No projects yet. Create a new project to get started!</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>Fill in the details to create a new project</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addProject} className="space-y-4">
              <div>
                <Input
                  placeholder="Project Name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Project Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div>
                <Input
                  placeholder="Project Manager"
                  value={newProject.manager}
                  onChange={(e) => setNewProject({ ...newProject, manager: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <Input
                    type="date"
                    value={format(newProject.startDate, "yyyy-MM-dd")}
                    onChange={(e) => handleDateChange("startDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <Input
                    type="date"
                    value={format(newProject.endDate, "yyyy-MM-dd")}
                    onChange={(e) => handleDateChange("endDate", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={newProject.status}
                  onValueChange={(value: Project["status"]) => setNewProject({ ...newProject, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
    
    
              <Button type="submit">Create Project</Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Make changes to the project details</DialogDescription>
          </DialogHeader>
          {editingProject && (
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Project Name"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Project Description"
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                />
              </div>
              <div>
                <Input
                  placeholder="Project Manager"
                  value={editingProject.manager}
                  onChange={(e) => setEditingProject({ ...editingProject, manager: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <Input
                    type="date"
                    value={format(editingProject.startDate, "yyyy-MM-dd")}
                    onChange={(e) => handleDateChange("startDate", e.target.value, true)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <Input
                    type="date"
                    value={format(editingProject.endDate, "yyyy-MM-dd")}
                    onChange={(e) => handleDateChange("endDate", e.target.value, true)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={editingProject.status}
                  onValueChange={(value: Project["status"]) => setEditingProject({ ...editingProject, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
             
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  )
}
