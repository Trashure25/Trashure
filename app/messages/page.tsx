"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/auth"
import type { User } from "@/lib/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { MessageCircle, Send, Search } from "lucide-react"

// Mock conversation data
interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  read: boolean
}

interface Conversation {
  id: string
  otherUser: {
    id: string
    name: string
    username: string
    avatar: string
  }
  lastMessage: Message
  unreadCount: number
  messages: Message[]
}

export default function MessagesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      otherUser: {
        id: "2",
        name: "Sarah Johnson",
        username: "sarahj",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=sarahj",
      },
      lastMessage: {
        id: "1",
        senderId: "2",
        senderName: "Sarah Johnson",
        content: "Is this item still available?",
        timestamp: "2024-01-15T10:30:00Z",
        read: false,
      },
      unreadCount: 2,
      messages: [
        {
          id: "1",
          senderId: "2",
          senderName: "Sarah Johnson",
          content: "Hi! I'm interested in your vintage Levi's jeans.",
          timestamp: "2024-01-15T10:00:00Z",
          read: true,
        },
        {
          id: "2",
          senderId: "2",
          senderName: "Sarah Johnson",
          content: "Is this item still available?",
          timestamp: "2024-01-15T10:30:00Z",
          read: false,
        },
      ],
    },
    {
      id: "2",
      otherUser: {
        id: "3",
        name: "Mike Chen",
        username: "mikechen",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=mikechen",
      },
      lastMessage: {
        id: "3",
        senderId: "1",
        senderName: "You",
        content: "Sure, let me know when you&apos;re free",
        timestamp: "2024-01-14T15:45:00Z",
        read: true,
      },
      unreadCount: 0,
      messages: [
        {
          id: "3",
          senderId: "3",
          senderName: "Mike Chen",
          content: "Would you be interested in trading for my Supreme hoodie?",
          timestamp: "2024-01-14T15:00:00Z",
          read: true,
        },
        {
          id: "4",
          senderId: "1",
          senderName: "You",
          content: "Sure, let me know when you&apos;re free",
          timestamp: "2024-01-14T15:45:00Z",
          read: true,
        },
      ],
    },
  ])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await auth.getCurrentUser()
        if (!currentUser) {
          router.push("/")
        } else {
          setUser(currentUser)
        }
      } catch (error) {
        console.error("Failed to fetch user", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [router])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, you would send the message to your backend
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
            <div className="bg-gray-200 rounded"></div>
            <div className="lg:col-span-2 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const selectedConv = conversations.find((conv) => conv.id === selectedConversation)

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No conversations yet</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === conversation.id ? "bg-blue-50 border-blue-200" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={conversation.otherUser.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {conversation.otherUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate">{conversation.otherUser.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-blue-500 text-white text-xs px-2 py-1">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConv ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedConv.otherUser.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedConv.otherUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{selectedConv.otherUser.name}</CardTitle>
                    <p className="text-sm text-gray-600">@{selectedConv.otherUser.username}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConv.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === user.id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${message.senderId === user.id ? "text-blue-100" : "text-gray-500"}`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
