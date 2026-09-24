import { isSessionActive } from '@/helpers/session';

const authenticateLogged = async () => {
	if (isSessionActive()) {
		return { name: 'Home' };
	}
};

export default authenticateLogged;
