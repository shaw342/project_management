import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const teamMembers = [
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Smith' },
  { id: 3, name: 'Charlie Brown' },
  { id: 4, name: 'Diana Martinez' },
]

export function Sidebar({ onSelectMember }:any) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-64 bg-gray-100 p-4 flex flex-col">
      <Input
        type="text"
        placeholder="Rechercher un membre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="flex-grow overflow-y-auto">
        {filteredMembers.map(member => (
          <Button
            key={member.id}
            onClick={() => onSelectMember(member)}
            variant="ghost"
            className="w-full justify-start mb-2"
          >
            {member.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

