import { TaskManager } from '@/components/task-manager'
import { Tabs,TabsContent,TabsTrigger,TabsList} from '@/components/ui/tabs'

export default function TaskPage() {
  return (
    <main className="container mx-auto p-4 w-[100%]">
      <Tabs defaultValue="create" className="w-full   mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="create">Create Task</TabsTrigger>
        <TabsTrigger value="list">Task List</TabsTrigger>
      </TabsList>
      <TabsContent value="create" className='flex justify-center'>
      <TaskManager/>
      </TabsContent>
      <TabsContent value="list">
        </TabsContent>
      </Tabs>
    </main>
  )
}