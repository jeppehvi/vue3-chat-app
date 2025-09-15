import { io, Socket } from 'socket.io-client'
import type { Message, User } from '../types'

class SocketService {
  emitStopTyping(username: string): void {
    if (!this.socket) throw new Error('Socket not connected')
    this.socket.emit('user_stop_typing', { username })
  }

  onUserStopTyping(callback: (data: { username: string }) => void): void {
    if (!this.socket) return
    this.socket.on('user_stop_typing', callback)
  }
  emitTyping(username: string): void {
    if (!this.socket) throw new Error('Socket not connected')
    this.socket.emit('user_typing', { username })
  }

  onUserTyping(callback: (data: { username: string }) => void): void {
    if (!this.socket) return
    this.socket.on('user_typing', callback)
  }
  private socket: Socket | null = null
  private readonly SERVER_URL = 'http://localhost:3001'

  async connect(): Promise<void> {
    if (this.socket?.connected) return

    this.socket = io(this.SERVER_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    return new Promise((resolve, reject) => {
      if (!this.socket) return reject(new Error('Socket not initialized'))

      this.socket.on('connect', () => {
        console.log('Connected to server')
        resolve()
      })

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error)
        reject(error)
      })
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  joinChat(username: string): void {
    if (!this.socket) throw new Error('Socket not connected')
    this.socket.emit('user_joined', { username })
  }

  sendMessage(content: string): void {
    if (!this.socket) throw new Error('Socket not connected')
    this.socket.emit('send_message', { content })
  }

  onMessageReceived(callback: (message: Message) => void): void {
    if (!this.socket) return
    this.socket.on('receive_message', callback)
  }

  onUserJoined(callback: (notification: Message) => void): void {
    if (!this.socket) return
    this.socket.on('user_joined_notification', callback)
  }

  onUserLeft(callback: (notification: Message) => void): void {
    if (!this.socket) return
    this.socket.on('user_left_notification', callback)
  }

  onOnlineUsersUpdated(callback: (users: User[]) => void): void {
    if (!this.socket) return
    this.socket.on('online_users_updated', (data) => {
      callback(data.users)
    })
  }

  removeAllListeners(): void {
    if (!this.socket) return
    this.socket.removeAllListeners()
  }

  get isConnected(): boolean {
    return this.socket?.connected || false
  }
}

export const socketService = new SocketService()