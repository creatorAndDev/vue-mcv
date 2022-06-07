import authApi from '@/api/auth';
import {setItem} from '@/helpers/persistanceStorage'

const state = {
	isSubmitting: false,
	currentUser: null,
	validationErrors: null,
	isLoggedIn: null
}

const mutations = {
	//start
	registerStart(state) {
		state.isSubmitting = true;
		state.validationErrors = null;
	},
	//success
	registerSuccess(state, payload) {
		state.isSubmitting = false;
		state.currentUser = payload;
		state.isLoggedIn = true;
	},
	//fail
	registerFailure(state, payload) {
		state.isSubmitting = false;
		state.validationErrors = payload;
	}
}

const actions = {
	register(context, credentials) {
		return new Promise(resolve => {
			context.commit('registerStart');
			authApi
				.register(credentials)
				.then(response => {
					//commit mustation/change state
					context.commit('registerSuccess', response.data.user);

					//save token in local storage (wrapper - persustanceStorage)
					setItem('accessToken', response.data.user.token);
					//save token in local storage
					// window.localStorage.setItem('accessToken', response.data.user.token);
					
					resolve(response.data.user);
				})
				.catch(result => { 
					context.commit('registerFailure', result.response.data.errors);
				})
		})
		// setTimeout(() => {
		// 	context.commit('registerStart');
		// }, 1000)
	}
}

export default {
	state,
	mutations,
	actions
}