import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 회원가입
export const register = (email, password) =>
  api.post('/auth/register', { email, password })

// 로그인
export const login = (email, password) =>
  api.post('/auth/login', { email, password })

// 구독 목록 조회
export const getSubscriptions = () =>
  api.get('/subscriptions')

// 구독 추가
export const addSubscription = (data) =>
  api.post('/subscriptions', data)

// 구독 수정
export const updateSubscription = (id, data) =>
  api.put(`/subscriptions/${id}`, data)

// 구독 삭제
export const deleteSubscription = (id) =>
  api.delete(`/subscriptions/${id}`)

// 순서 변경
export const reorderSubscriptions = (orderedIds) =>
  api.put('/subscriptions/reorder', { orderedIds })