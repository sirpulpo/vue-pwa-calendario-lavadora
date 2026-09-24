import { isSessionActive, clearSession } from '@/helpers/session';

const authenticateGuard = async () => {
	if (!isSessionActive()) {
		clearSession();
		return { name: 'Login' };
	}
};

export default authenticateGuard;
