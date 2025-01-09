'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { Sidebar } from '@/components/chatSidebar'
import { ChatInterface } from '@/components/chat-interface'

export default function TeamChat() {
  const [selectedMember, setSelectedMember] = useState(null)
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div className="flex h-screen w-[1400px]">
      <Sidebar onSelectMember={setSelectedMember} />
      <ChatInterface
        selectedMember={selectedMember}
        messages={messages}
        input={input}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

