"use client"
import { CreateTask } from '@/components/createTask'
import { Tabs,TabsContent,TabsList,TabsTrigger } from "@/components/ui/tabs";


export default function TaskPage() {
  return (
    <div className="container mx-auto p-4">
      <Tabs>
        <TabsList>
          <TabsTrigger value="all">All tasks</TabsTrigger>
          <TabsTrigger value="create">Create task</TabsTrigger>
        </TabsList>
        <TabsContent value='all'>
          
        </TabsContent>
        <TabsContent value="create">
        <CreateTask />
        </TabsContent>
      </Tabs>
    </div>
  )
}