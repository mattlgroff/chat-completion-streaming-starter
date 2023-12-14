import { type Message } from 'ai'

import { Separator } from './ui/separator'
import { ChatMessage } from './chat-message'

export interface ChatList {
  messages: Message[]
  activeModel: string
}

export function ChatList({ messages, activeModel }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} activeModel={activeModel} />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
    </div>
  )
}
