import http from '@/services/http'

const RESOURCE = '/reservations'

const toISODate = (date) => (date instanceof Date ? date.toISOString() : date)

class ReservationService {
	async getAll({ from, to } = {}, { signal } = {}) {
		try {
			const { data } = await http.get(RESOURCE, {
				params: { from: toISODate(from), to: toISODate(to) },
				signal,
			})
			return data.reservations
		} catch (err) {
			throw err.response ?? err
		}
	}

	async getById(id, { signal } = {}) {
		try {
			const { data } = await http.get(`${RESOURCE}/${encodeURIComponent(id)}`, { signal })
			return data.reservation
		} catch (err) {
			throw err.response ?? err
		}
	}

	async create({ date, comments }) {
		try {
			const { data } = await http.post(RESOURCE, { date: toISODate(date), comments })
			return data.reservation
		} catch (err) {
			throw err.response ?? err
		}
	}

	async update(id, { date, comments } = {}) {
		try {
			const { data } = await http.put(`${RESOURCE}/${encodeURIComponent(id)}`, {
				date: toISODate(date),
				comments,
			})
			return data.reservation
		} catch (err) {
			throw err.response ?? err
		}
	}

	async remove(id) {
		try {
			const { data } = await http.delete(`${RESOURCE}/${encodeURIComponent(id)}`)
			return data.reservation
		} catch (err) {
			throw err.response ?? err
		}
	}
}

export default new ReservationService()
