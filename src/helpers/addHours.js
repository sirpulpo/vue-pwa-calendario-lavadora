const addHours = (date, hours = 0) => {
	const hoursToAdd = hours * 60 * 60 * 1000;
	return new Date(date.getTime() + hoursToAdd);
}

export default addHours
