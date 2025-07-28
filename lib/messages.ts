export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  read: boolean
  createdAt: string
}

export interface Conversation {
  id: string
  user1Id: string
  user2Id: string
  listingId?: string
  listing?: {
    id: string
    title: string
    images: string[]
  }
  otherUser: {
    id: string
    firstName: string
    lastName: string
    username: string
    avatarUrl?: string
  }
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateMessageData {
  conversationId: string
  content: string
}

export interface CreateConversationData {
  otherUserId: string
  listingId?: string
  initialMessage: string
}

export const messagesService = {
  // Get all conversations for a user
  async getConversations(userId: string): Promise<Conversation[]> {
    const response = await fetch(`/api/messages/conversations?userId=${userId}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch conversations')
    }
    
    const data = await response.json()
    return data.conversations || data
  },

  // Get messages for a specific conversation
  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await fetch(`/api/messages/${conversationId}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages')
    }
    
    const data = await response.json()
    return data.messages || data
  },

  // Send a message
  async sendMessage(data: CreateMessageData): Promise<Message> {
    const response = await fetch('/api/messages/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to send message')
    }
    
    return response.json()
  },

  // Create a new conversation
  async createConversation(data: CreateConversationData): Promise<Conversation> {
    const response = await fetch('/api/messages/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create conversation')
    }
    
    return response.json()
  },

  // Mark messages as read
  async markAsRead(conversationId: string, userId: string): Promise<void> {
    const response = await fetch(`/api/messages/${conversationId}/read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to mark messages as read')
    }
  },

  // Get unread count for a user
  async getUnreadCount(userId: string): Promise<number> {
    const response = await fetch(`/api/messages/unread-count?userId=${userId}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch unread count')
    }
    
    const data = await response.json()
    return data.count || 0
  },
} 