//save localstorage helper
export const getItem = key => {
	try {
		return JSON.parse(localStorage.getIte(key));
	} catch (e) {
		console.log('Error getting data from localStorage', e);
		return null;
	}
}

export const setItem = (key, data) => {
	try {
		localStorage.setItem(key, JSON.stringify(data));
		// return JSON.parse(localStorage.getIte(key));
	} catch (e) {
		console.log('Error saving data from localStorage', e);
	}
}