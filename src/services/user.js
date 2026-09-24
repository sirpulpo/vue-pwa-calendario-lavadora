import http from '@/services/http'

class UserService {
	async updateNip({ currentNip, newNip }) {
		try {
			const { data } = await http.patch('/users/nip', { currentNip, newNip })
			return data.token
		} catch (err) {
			throw err.response ?? err
		}
	}
}

export default new UserService()
