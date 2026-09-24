import addHours from '@/helpers/addHours'

const TOKEN_KEY = 'xTknApiCL'
const EXP_KEY = 'xTknApiCL_exp'
const USER_KEY = 'user'

export function saveSession({ token, user }) {
  sessionStorage.setItem(TOKEN_KEY, token)
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
  sessionStorage.setItem(EXP_KEY, addHours(new Date(), 2).toISOString())
}

export function getSessionUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function isSessionActive() {
  const token = sessionStorage.getItem(TOKEN_KEY)
  const exp = sessionStorage.getItem(EXP_KEY)
  if (!token || !exp) return false

  return new Date(exp).getTime() > Date.now()
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(EXP_KEY)
  sessionStorage.removeItem(USER_KEY)
}
