"use client"

import { useState, useRef, useEffect } from "react"
import { Send, X, MessageCircle, Phone, Video, Paperclip, Smile } from "lucide-react"
import Image from "next/image"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  type: "text" | "image" | "file"
  read: boolean
}

interface ChatSystemProps {
  campaignId: string
  currentUserId: string
  currentUserName: string
  currentUserAvatar: string
}

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "creator1",
    senderName: "Aminata Kamara",
    senderAvatar: "/placeholder.svg?height=40&width=40",
    content: "Thank you so much for your donation! Your support means everything to our community.",
    timestamp: "2024-01-20T10:30:00Z",
    type: "text",
    read: true,
  },
  {
    id: "2",
    senderId: "donor1",
    senderName: "Mohamed Sesay",
    senderAvatar: "/placeholder.svg?height=40&width=40",
    content: "I'm happy to help! Can you provide more details about how the funds will be used?",
    timestamp: "2024-01-20T10:35:00Z",
    type: "text",
    read: true,
  },
  {
    id: "3",
    senderId: "creator1",
    senderName: "Aminata Kamara",
    senderAvatar: "/placeholder.svg?height=40&width=40",
    content: "Of course! We'll use 60% for water pump installation, 30% for piping, and 10% for maintenance training.",
    timestamp: "2024-01-20T10:40:00Z",
    type: "text",
    read: false,
  },
]

export default function ChatSystem({ campaignId, currentUserId, currentUserName, currentUserAvatar }: ChatSystemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserName,
      senderAvatar: currentUserAvatar,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
      read: false,
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      // Simulate response
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: "creator1",
        senderName: "Aminata Kamara",
        senderAvatar: "/placeholder.svg?height=40&width=40",
        content: "Thank you for your message! I'll get back to you shortly.",
        timestamp: new Date().toISOString(),
        type: "text",
        read: false,
      }
      setMessages((prev) => [...prev, response])
    }, 2000)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-50"
      >
        <MessageCircle className="w-6 h-6" />
        {messages.filter((m) => !m.read && m.senderId !== currentUserId).length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {messages.filter((m) => !m.read && m.senderId !== currentUserId).length}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-indigo-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          <Image src="/placeholder.svg?height=32&width=32" alt="Campaign Creator" className="w-8 h-8 rounded-full" />
          <div>
            <h3 className="font-semibold">Aminata Kamara</h3>
            <p className="text-xs opacity-90">Campaign Creator</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-indigo-700 rounded">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-indigo-700 rounded">
            <Video className="w-4 h-4" />
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-indigo-700 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex items-end space-x-2 max-w-[80%]`}>
              {message.senderId !== currentUserId && (
                <Image
                  src={message.senderAvatar || "/placeholder.svg"}
                  alt={message.senderName}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <div>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.senderId === currentUserId ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <p className="text-xs text-slate-500 mt-1">{formatTime(message.timestamp)}</p>
              </div>
              {message.senderId === currentUserId && (
                <Image
                  src={message.senderAvatar || "/placeholder.svg"}
                  alt={message.senderName}
                  className="w-6 h-6 rounded-full"
                />
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
              <Image src="/placeholder.svg?height=24&width=24" alt="Creator" className="w-6 h-6 rounded-full" />
              <div className="bg-slate-100 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-slate-400 hover:text-slate-600">
            <Paperclip className="w-4 h-4" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600">
              <Smile className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
