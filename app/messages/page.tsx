"use client"

import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { MessageCircle, Send, Search, Loader2 } from "lucide-react"
import { messagesService, type Conversation, type Message } from "@/lib/messages"
import { listingsService, type Listing } from "@/lib/listings"
import { toast } from "sonner"
import TradeOfferModal from "@/components/trade-offer-modal"

export default function MessagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false)
  const [userListings, setUserListings] = useState<Listing[]>([])
  const [targetListing, setTargetListing] = useState<Listing | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch conversations
  const fetchConversations = async () => {
    if (!currentUser) return
    
    try {
      const data = await messagesService.getConversations(currentUser.id)
      setConversations(data)
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
      toast.error('Failed to load conversations')
    }
  }

  // Fetch user listings for trade offers
  const fetchUserListings = async () => {
    if (!currentUser) return
    
    try {
      const data = await listingsService.getUserListings(currentUser.id)
      setUserListings(data.filter(listing => listing.status === 'active'))
    } catch (error) {
      console.error('Failed to fetch user listings:', error)
      toast.error('Failed to load your listings')
    }
  }

  // Handle trade offer button click
  const handleMakeTradeOffer = async (listingId: string) => {
    if (!currentUser) {
      toast.error('Please log in to make trade offers')
      return
    }

    try {
      // Fetch the target listing
      const listing = await listingsService.getListingById(listingId)
      setTargetListing(listing)
      
      // Fetch user's active listings
      await fetchUserListings()
      
      // Open the trade modal
      setIsTradeModalOpen(true)
    } catch (error) {
      console.error('Failed to load listing for trade offer:', error)
      toast.error('Failed to load listing details')
    }
  }

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      const data = await messagesService.getMessages(conversationId)
      setMessages(data)
      
      // Mark messages as read
      await messagesService.markAsRead(conversationId, currentUser!.id)
      
      // Update conversations to reflect read status
      fetchConversations()
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      toast.error('Failed to load messages')
    }
  }

  // Send a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return

    setSending(true)
    try {
      const message = await messagesService.sendMessage({
        conversationId: selectedConversation,
        content: newMessage.trim()
      })
      
      setMessages(prev => [...prev, message])
      setNewMessage("")
      
      // Update conversations to show new last message
      fetchConversations()
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId)
    fetchMessages(conversationId)
    
    // Update URL without page reload
    const url = new URL(window.location.href)
    url.searchParams.set('conversation', conversationId)
    window.history.pushState({}, '', url.toString())
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initial load
  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }

    const loadData = async () => {
      setLoading(true)
      await fetchConversations()
      
      // Check if there's a conversation ID in the URL
      const conversationId = searchParams.get('conversation')
      if (conversationId) {
        // Verify the conversation exists and user has access
        const conversation = conversations.find(conv => conv.id === conversationId)
        if (conversation) {
          setSelectedConversation(conversationId)
          await fetchMessages(conversationId)
        }
      }
      
      setLoading(false)
    }

    loadData()
  }, [currentUser, router, searchParams])

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    return (
      conv.otherUser.firstName.toLowerCase().includes(searchLower) ||
      conv.otherUser.lastName.toLowerCase().includes(searchLower) ||
      conv.otherUser.username.toLowerCase().includes(searchLower) ||
      conv.lastMessage?.content.toLowerCase().includes(searchLower)
    )
  })

  const selectedConv = conversations.find((conv) => conv.id === selectedConversation)

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
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

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
              <Input 
                placeholder="Search conversations..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    {searchQuery ? 'No conversations found' : 'No conversations yet'}
                  </p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.id ? "bg-blue-50 border-blue-200" : ""
                    }`}
                    onClick={() => handleSelectConversation(conversation.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={conversation.otherUser.avatarUrl || "/placeholder.svg"} />
                        <AvatarFallback>
                          {conversation.otherUser.firstName[0]}{conversation.otherUser.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate">
                            {conversation.otherUser.firstName} {conversation.otherUser.lastName}
                          </p>
                          <div className="flex items-center gap-2">
                            {conversation.lastMessage && (
                              <span className="text-xs text-gray-500">
                                {formatTime(conversation.lastMessage.createdAt)}
                              </span>
                            )}
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-blue-500 text-white text-xs px-2 py-1">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {conversation.listing && (
                          <p className="text-xs text-gray-500 truncate">
                            Re: {conversation.listing.title}
                          </p>
                        )}
                        {conversation.lastMessage && (
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage.content}
                          </p>
                        )}
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
                    <AvatarImage src={selectedConv.otherUser.avatarUrl || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedConv.otherUser.firstName[0]}{selectedConv.otherUser.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {selectedConv.otherUser.firstName} {selectedConv.otherUser.lastName}
                    </CardTitle>
                    <p className="text-sm text-gray-600">@{selectedConv.otherUser.username}</p>
                    {selectedConv.listing && (
                      <p className="text-xs text-gray-500">
                        Re: {selectedConv.listing.title}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No messages yet</p>
                      <p className="text-sm text-gray-500">Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === currentUser.id 
                              ? "bg-blue-500 text-white" 
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.senderId === currentUser.id 
                                ? "text-blue-100" 
                                : "text-gray-500"
                            }`}
                          >
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                {/* Trade Offer Buttons */}
                {selectedConv && selectedConv.listing && (
                  <div className="border-t p-4 bg-gray-50">
                    <div className="flex gap-2 mb-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleMakeTradeOffer(selectedConv.listing.id)}
                        className="flex-1"
                      >
                        💰 Make Trade Offer
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/purchase?listing=${selectedConv.listing?.id}`)}
                        className="flex-1"
                      >
                        🛒 Purchase with Credits
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && !sending && handleSendMessage()}
                      disabled={sending}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={sending || !newMessage.trim()}
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
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
      {targetListing && (
        <TradeOfferModal
          isOpen={isTradeModalOpen}
          onOpenChange={setIsTradeModalOpen}
          userListings={userListings}
          targetListing={targetListing}
        />
      )}
    </div>
  )
}
