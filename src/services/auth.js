import axios from 'axios';
import { saveSession, clearSession } from '@/helpers/session';

class AuthService {
	async loginService(usr) {
		try {
			const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, usr);
			saveSession({ token: data.token, user: data.user });
			return data.user;
		} catch (err) {
			throw err.response ?? err;
		}
	}

	logout() {
		clearSession();
	}
}

export default new AuthService();
