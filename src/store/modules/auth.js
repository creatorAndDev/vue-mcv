import authApi from '@/api/auth';
import {setItem} from '@/helpers/persistanceStorage'

const state = {
	isSubmitting: false,
	currentUser: null,
	validationErrors: null,
	isLoggedIn: null
}

export const mutationTypes = {
	registerStart: '[auth] registerStart',
	registerSuccess: '[auth] registerSuccess',
	registerFailure: '[auth] registerFailure',

	loginStart: '[auth] registerStart',
	loginSuccess: '[auth] registerSuccess',
	loginFailure: '[auth] registerFailure'
}

export const actionTypes = {
	register: '[auth] register',
	login: '[auth] login'
}

export const getterTypes = {
	currentUser: '[auth] currentUser',
	isLoggedIn: '[auth] isLoggedIn',
	isAnonymous: '[auth] isAnonymous'
}

const getters = {
	[getterTypes.currentUser]: state => {
		return state.currentUser;
	},
	[getterTypes.isLoggedIn]: state => {
		return Boolean(state.isLoggedIn);
	},
	[getterTypes.isAnonymous]: state => {
		return state.isLoggedIn === false;
	}
}

const mutations = {
	//register
	//start
	[mutationTypes.registerStart](state) {
		state.isSubmitting = true;
		state.validationErrors = null;
	},
	//success
	[mutationTypes.registerSuccess](state, payload) {
		state.isSubmitting = false;
		state.currentUser = payload;
		state.isLoggedIn = true;
	},
	//fail
	[mutationTypes.registerFailure](state, payload) {
		state.isSubmitting = false;
		state.validationErrors = payload;
	},

	//login
	[mutationTypes.loginStart](state) {
		state.isSubmitting = true;
		state.validationErrors = null;
	},
	[mutationTypes.loginSuccess](state, payload) {
		state.isSubmitting = false;
		state.currentUser = payload;
		state.isLoggedIn = true;
	},
	[mutationTypes.loginFailure](state, payload) {
		state.isSubmitting = false;
		state.validationErrors = payload;
	}
}

const actions = {
	//action register
	[actionTypes.register](context, credentials) {
		return new Promise(resolve => {
			context.commit(mutationTypes.registerStart);
			authApi.register(credentials)
				.then(response => {
					//commit mustation/change state
					context.commit(mutationTypes.registerSuccess, response.data.user);

					//save token in local storage (wrapper - persustanceStorage)
					setItem('accessToken', response.data.user.token);
					//save token in local storage
					// window.localStorage.setItem('accessToken', response.data.user.token);
					
					resolve(response.data.user);
				})
				.catch(result => {
					context.commit(mutationTypes.registerFailure, result.response.data.errors);
				})
		});
		// setTimeout(() => {
		// 	context.commit('registerStart');
		// }, 1000)
	},

	//action login
	[actionTypes.login](context, credentials) {
		return new Promise(resolve => {
			context.commit(mutationTypes.loginStart);
			authApi.login(credentials)
				.then(response => {
					//commit mustation/change state
					context.commit(mutationTypes.loginSuccess, response.data.user);

					setItem('accessToken', response.data.user.token);
					resolve(response.data.user);
				})
				.catch(result => {
					context.commit(mutationTypes.loginFailure, result.response.data.errors);
				})
		});
	}
}

export default {
	state,
	mutations,
	actions,
	getters
}