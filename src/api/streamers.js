import { apiClient } from './client'

export function getStreamers() {
  return apiClient.get('/streamers')
}

export function createStreamer(data) {
  return apiClient.post('/streamers', data)
}

export function deleteStreamer(id) {
  return apiClient.delete(`/streamers/${id}`)
}
