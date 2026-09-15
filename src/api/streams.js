import { apiClient } from './client'

// params: { streamerId, platform, year, month }
export function getStreams(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null),
  ).toString()
  return apiClient.get(`/streams${query ? `?${query}` : ''}`)
}

export function getStream(id) {
  return apiClient.get(`/streams/${id}`)
}

export function createStream(data) {
  return apiClient.post('/streams', data)
}

export function updateStream(id, data) {
  return apiClient.put(`/streams/${id}`, data)
}

export function deleteStream(id) {
  return apiClient.delete(`/streams/${id}`)
}
