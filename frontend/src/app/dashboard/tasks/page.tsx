import { DetailedTaskSection } from '@/components/detailed-task-section'

export default function TaskPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestionnaire de Tâches Détaillées</h1>
      <DetailedTaskSection />
    </div>
  )
}