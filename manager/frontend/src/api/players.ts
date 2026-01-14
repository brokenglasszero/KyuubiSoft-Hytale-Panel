import api from './client'

export interface PlayerInfo {
  name: string
  joined_at: string
  session_duration_seconds: number
  session_duration: string
}

export interface PlayersResponse {
  players: PlayerInfo[]
  count: number
}

export interface ActionResponse {
  success: boolean
  message?: string
  error?: string
}

export const playersApi = {
  async getOnline(): Promise<PlayersResponse> {
    const response = await api.get<PlayersResponse>('/players')
    return response.data
  },

  async getCount(): Promise<{ count: number }> {
    const response = await api.get<{ count: number }>('/players/count')
    return response.data
  },

  async kick(playerName: string): Promise<ActionResponse> {
    const response = await api.post<ActionResponse>(`/players/${playerName}/kick`)
    return response.data
  },

  async ban(playerName: string): Promise<ActionResponse> {
    const response = await api.post<ActionResponse>(`/players/${playerName}/ban`)
    return response.data
  },

  async unban(playerName: string): Promise<ActionResponse> {
    const response = await api.delete<ActionResponse>(`/players/${playerName}/ban`)
    return response.data
  },

  async addToWhitelist(playerName: string): Promise<ActionResponse> {
    const response = await api.post<ActionResponse>(`/players/${playerName}/whitelist`)
    return response.data
  },

  async removeFromWhitelist(playerName: string): Promise<ActionResponse> {
    const response = await api.delete<ActionResponse>(`/players/${playerName}/whitelist`)
    return response.data
  },

  async op(playerName: string): Promise<ActionResponse> {
    const response = await api.post<ActionResponse>(`/players/${playerName}/op`)
    return response.data
  },

  async deop(playerName: string): Promise<ActionResponse> {
    const response = await api.delete<ActionResponse>(`/players/${playerName}/op`)
    return response.data
  },

  async sendMessage(playerName: string, message: string): Promise<ActionResponse> {
    const response = await api.post<ActionResponse>(`/players/${playerName}/message`, { message })
    return response.data
  },

  async teleport(playerName: string, options: { target?: string; x?: number; y?: number; z?: number }): Promise<ActionResponse> {
    const response = await api.post<ActionResponse>(`/players/${playerName}/teleport`, options)
    return response.data
  },

  async kill(playerName: string): Promise<ActionResponse> {
    const response = await api.post<ActionResponse>(`/players/${playerName}/kill`)
    return response.data
  },

  async respawn(playerName: string): Promise<ActionResponse> {
    const response = await api.post<ActionResponse>(`/players/${playerName}/respawn`)
    return response.data
  },

  async gamemode(playerName: string, gamemode: string): Promise<ActionResponse> {
    const response = await api.post<ActionResponse>(`/players/${playerName}/gamemode`, { gamemode })
    return response.data
  },

  async give(playerName: string, item: string, amount?: number): Promise<ActionResponse> {
    const response = await api.post<ActionResponse>(`/players/${playerName}/give`, { item, amount })
    return response.data
  },

  async heal(playerName: string): Promise<ActionResponse> {
    const response = await api.post<ActionResponse>(`/players/${playerName}/heal`)
    return response.data
  },

  async clearEffects(playerName: string): Promise<ActionResponse> {
    const response = await api.post<ActionResponse>(`/players/${playerName}/effect`, { effect: 'all', action: 'clear' })
    return response.data
  },

  async clearInventory(playerName: string): Promise<ActionResponse> {
    const response = await api.post<ActionResponse>(`/players/${playerName}/inventory/clear`)
    return response.data
  },
}
