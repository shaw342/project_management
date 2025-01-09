import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"

export function ChatInterface({selectedMember, messages, input, onInputChange, onSubmit }:any) {
  if (!selectedMember) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <p className="text-gray-500">Sélectionnez un membre pour commencer à discuter</p>
      </div>
    )
  }

  return (
    <div className="flex-grow flex flex-col">
      <div className="bg-white p-4 shadow">
        <h2 className="text-xl font-bold">{selectedMember.name}</h2>
      </div>
      <ScrollArea className="flex-grow p-4">
        {messages.map((message: { id: Key | null | undefined; role: string; content: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-black'
              }`}
            >
              {message.content}
            </span>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={onSubmit} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={onInputChange}
            placeholder="Tapez votre message..."
            className="flex-grow"
          />
          <Button type="submit">Envoyer</Button>
        </div>
      </form>
    </div>
  )
}

