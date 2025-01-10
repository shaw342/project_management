"use client"

import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Event } from './types/calendar'

interface EventFormProps {
  selectedDate: Date
  onEventAdded: (event: Event) => void
  onClose: () => void
}

export function EventForm({ selectedDate, onEventAdded, onClose }: EventFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onEventAdded({
      date: selectedDate,
      title,
      description
    })
    setTitle('')
    setDescription('')
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Ajouter un événement</h2>
        <p className="mb-4">
          Date : {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

