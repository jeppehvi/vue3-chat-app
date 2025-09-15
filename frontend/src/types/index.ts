export interface Message {
  id: number | string
  username: string
  content: string
  timestamp: string
  type: 'user' | 'system'
}

export interface User {
  id: string
  username: string
  joinedAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}