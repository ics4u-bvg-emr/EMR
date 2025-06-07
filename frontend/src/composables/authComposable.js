import { ref } from 'vue'
import jwt_decode from 'jwt-decode'

const token = ref(localStorage.getItem('token') || null)
const user = ref(token.value ? jwt_decode(token.value) : null)

export function useAuth() {
  const isAuthenticated = () => !!token.value

  const logout = () => {
    localStorage.removeItem('token')
    token.value = null
    user.value = null
  }

  return { token, user, isAuthenticated, logout }
}
