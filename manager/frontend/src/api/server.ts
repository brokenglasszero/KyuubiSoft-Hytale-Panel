import api from './client'

export interface ServerStatus {
  status: string
  running: boolean
  id?: string
  name?: string
  created?: string
  started_at?: string
  error?: string
}

export interface ServerStats {
  cpu_percent?: number
  memory_bytes?: number
  memory_limit_bytes?: number
  memory_percent?: number
  memory_mb?: number
  memory_limit_mb?: number
  error?: string
}

export interface ActionResponse {
  success: boolean
  message?: string
  error?: string
}

export const serverApi = {
  async getStatus(): Promise<ServerStatus> {
    const response = await api.get<ServerStatus>('/server/status')
    return response.data
  },

  async getStats(): Promise<ServerStats> {
    const response = await api.get<ServerStats>('/server/stats')
    return response.data
  },

  async start(): Promise<ActionResponse> {
    const response = await api.post<ActionResponse>('/server/start')
    return response.data
  },

  async stop(): Promise<ActionResponse> {
    const response = await api.post<ActionResponse>('/server/stop')
    return response.data
  },

  async restart(): Promise<ActionResponse> {
    const response = await api.post<ActionResponse>('/server/restart')
    return response.data
  },
}
