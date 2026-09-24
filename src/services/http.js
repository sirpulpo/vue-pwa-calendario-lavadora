import axios from 'axios'
import { getSessionToken, clearSession } from '@/helpers/session'

const http = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL}/api`,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
})

http.interceptors.request.use((config) => {
	const token = getSessionToken()
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

http.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			clearSession()
		}
		return Promise.reject(error)
	}
)

export default http
