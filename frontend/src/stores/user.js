import { ref } from 'vue'

export const userRole = ref(localStorage.getItem('role') || null)

export function setUserRole(role) {
  userRole.value = role
  if (role) {
    localStorage.setItem('role', role)
  } else {
    localStorage.removeItem('role')
  }
}
