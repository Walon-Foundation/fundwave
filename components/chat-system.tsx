"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  X,
  MessageCircle,
  Phone,
  Video,
  Paperclip,
  Smile,
  MoreVertical,
  Search,
  Archive,
  Star,
  CheckCheck,
  Check,
  Clock,
  ImageIcon,
  File,
  Loader2,
} from "lucide-react"
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
  status: "sending" | "sent" | "delivered" | "read"
  isStarred?: boolean
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
    content:
      "Thank you so much for your donation! Your support means everything to our community. We're making great progress on the water project.",
    timestamp: "2024-01-20T10:30:00Z",
    type: "text",
    read: true,
    status: "read",
  },
  {
    id: "2",
    senderId: "donor1",
    senderName: "Mohamed Sesay",
    senderAvatar: "/placeholder.svg?height=40&width=40",
    content:
      "I'm happy to help! Can you provide more details about how the funds will be used? I'd love to see some progress photos too.",
    timestamp: "2024-01-20T10:35:00Z",
    type: "text",
    read: true,
    status: "read",
  },
  {
    id: "3",
    senderId: "creator1",
    senderName: "Aminata Kamara",
    senderAvatar: "/placeholder.svg?height=40&width=40",
    content:
      "Of course! We'll use 60% for water pump installation, 30% for piping, and 10% for maintenance training. I'll share some photos from our recent site visit.",
    timestamp: "2024-01-20T10:40:00Z",
    type: "text",
    read: false,
    status: "delivered",
    isStarred: true,
  },
]

export default function ChatSystem({ campaignId, currentUserId, currentUserName, currentUserAvatar }: ChatSystemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [lastSeen, setLastSeen] = useState("2 minutes ago")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const tempId = Date.now().toString()
    const message: Message = {
      id: tempId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderAvatar: currentUserAvatar,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
      read: false,
      status: "sending",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
    setIsLoading(true)

    // Simulate API call with status updates
    setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, status: "sent" } : m)))
    }, 500)

    setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, status: "delivered" } : m)))
    }, 1000)

    // Simulate typing indicator and response
    setTimeout(() => {
      setIsTyping(true)
    }, 1500)

    setTimeout(() => {
      setIsTyping(false)
      setIsLoading(false)

      const responses = [
        "Thank you for your message! I'll get back to you shortly with more details.",
        "That's a great question! Let me gather some information and respond properly.",
        "I appreciate your interest in our campaign. I'll send you an update soon!",
        "Thanks for reaching out! I'm currently reviewing your message and will respond within the hour.",
      ]

      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: "creator1",
        senderName: "Aminata Kamara",
        senderAvatar: "/placeholder.svg?height=40&width=40",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        type: "text",
        read: false,
        status: "delivered",
      }
      setMessages((prev) => [...prev, response])

      // Mark original message as read
      setTimeout(() => {
        setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, status: "read" } : m)))
      }, 2000)
    }, 3000)
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Simulate file upload
      const message: Message = {
        id: Date.now().toString(),
        senderId: currentUserId,
        senderName: currentUserName,
        senderAvatar: currentUserAvatar,
        content: `📎 ${file.name}`,
        timestamp: new Date().toISOString(),
        type: "file",
        read: false,
        status: "sending",
      }
      setMessages((prev) => [...prev, message])
    }
  }

  const toggleStarMessage = (messageId: string) => {
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, isStarred: !m.isStarred } : m)))
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sending":
        return <Clock className="w-3 h-3 text-slate-400" />
      case "sent":
        return <Check className="w-3 h-3 text-slate-400" />
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-slate-400" />
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />
      default:
        return null
    }
  }

  const filteredMessages = messages.filter(
    (message) =>
      message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.senderName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const unreadCount = messages.filter((m) => !m.read && m.senderId !== currentUserId).length

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-2xl shadow-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 group"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse shadow-lg">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Campaign Creator"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full border-2 border-white/20"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                isOnline ? "bg-green-400" : "bg-slate-400"
              }`}
            ></div>
          </div>
          <div>
            <h3 className="font-bold text-lg">Aminata Kamara</h3>
            <p className="text-xs opacity-90">{isOnline ? "Online now" : `Last seen ${lastSeen}`}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Search messages"
          >
            <Search className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Voice call">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Video call">
            <Video className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="More options">
            <MoreVertical className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="p-3 border-b border-slate-200 bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      )}

      {/* Enhanced Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
        {filteredMessages.map((message, index) => {
          const showAvatar = index === 0 || filteredMessages[index - 1].senderId !== message.senderId
          const isCurrentUser = message.senderId === currentUserId

          return (
            <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} group`}>
              <div
                className={`flex items-end space-x-2 max-w-[85%] ${isCurrentUser ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                {!isCurrentUser && showAvatar && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={message.senderAvatar || "/placeholder.svg"}
                      alt={message.senderName}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {!isCurrentUser && !showAvatar && <div className="w-8" />}

                <div className="relative">
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : "bg-white text-slate-900 border border-slate-200"
                    } ${selectedMessage === message.id ? "ring-2 ring-indigo-300" : ""}`}
                    onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
                  >
                    {message.type === "file" && (
                      <div className="flex items-center space-x-2 mb-2">
                        <File className="w-4 h-4" />
                        <span className="text-sm font-medium">File attachment</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed break-words">{message.content}</p>

                    <div
                      className={`flex items-center justify-between mt-2 text-xs ${
                        isCurrentUser ? "text-white/70" : "text-slate-500"
                      }`}
                    >
                      <span>{formatTime(message.timestamp)}</span>
                      <div className="flex items-center space-x-1">
                        {message.isStarred && <Star className="w-3 h-3 fill-current text-yellow-400" />}
                        {isCurrentUser && getStatusIcon(message.status)}
                      </div>
                    </div>
                  </div>

                  {/* Message actions */}
                  {selectedMessage === message.id && (
                    <div className="absolute top-0 right-0 transform translate-x-full -translate-y-2 bg-white rounded-lg shadow-lg border border-slate-200 p-1 flex space-x-1 animate-in slide-in-from-left-2 duration-200">
                      <button
                        onClick={() => toggleStarMessage(message.id)}
                        className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                        title={message.isStarred ? "Unstar message" : "Star message"}
                      >
                        <Star
                          className={`w-4 h-4 ${message.isStarred ? "fill-current text-yellow-400" : "text-slate-400"}`}
                        />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-md transition-colors" title="Archive message">
                        <Archive className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  )}
                </div>

                {isCurrentUser && showAvatar && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={message.senderAvatar || "/placeholder.svg"}
                      alt={message.senderName}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {isCurrentUser && !showAvatar && <div className="w-8" />}
              </div>
            </div>
          )
        })}

        {/* Enhanced typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-in slide-in-from-left-2 duration-300">
            <div className="flex items-end space-x-2">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="Creator"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl shadow-sm">
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

      {/* Enhanced Input */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-end space-x-3">
          <div className="flex space-x-1">
            <button
              onClick={handleFileUpload}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
              title="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
              title="Add image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder="Type a message..."
              className="w-full px-4 py-3 pr-10 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none max-h-20 min-h-[48px]"
              rows={1}
              style={{ height: "auto" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = "auto"
                target.style.height = target.scrollHeight + "px"
              }}
            />
            <button
              className="absolute right-3 bottom-3 p-1 text-slate-400 hover:text-indigo-600 transition-colors"
              title="Add emoji"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:shadow-lg flex items-center justify-center min-w-[48px]"
            title="Send message"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>

        {/* Character count and status */}
        <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
          <span>{newMessage.length}/1000</span>
          {isOnline && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Online</span>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  )
}
