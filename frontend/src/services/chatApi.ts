import axios from 'axios'
import type { ApiResponse } from '../types'

const API_BASE_URL = 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const chatApi = {
  async joinChat(username: string): Promise<ApiResponse> {
    const response = await api.post('/users/join', { username })
    return response.data
  },

  async getOnlineUsers(): Promise<ApiResponse> {
    const response = await api.get('/users/online')
    return response.data
  }
}