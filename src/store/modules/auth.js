import authApi from '@/api/auth';
import {setItem} from '@/helpers/persistanceStorage'

const state = {
	isSubmitting: false,
	isLoading: false,
	currentUser: null,
	validationErrors: null,
	isLoggedIn: null
}

export const mutationTypes = {
	registerStart: '[auth] Register Start',
	registerSuccess: '[auth] Register Success',
	registerFailure: '[auth] Register Failure',

	loginStart: '[auth] Login Start',
	loginSuccess: '[auth] Login Success',
	loginFailure: '[auth] Login Failure',

	getCurrentUserStart: '[auth] Get current user start',
	getCurrentUserSuccess: '[auth] Get current user success',
	getCurrentUserFailure: '[auth] Get current user failure',

	updateCurrentUserStart: '[auth] Update current user start',
	updateCurrentUserSuccess: '[auth] Update current user success',
	updateCurrentUserFailure: '[auth] Update current user failure'
}

export const actionTypes = {
	register: '[auth] register',
	login: '[auth] login',
	getCurrentUser: '[auth] Get current user',
	updateCurrentUser: '[auth] Update current user'
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
	},

	//loading
	[mutationTypes.getCurrentUserStart](state) {
		state.isLoading = true;
	},
	[mutationTypes.getCurrentUserSuccess](state, payload) {
		state.isLoading = false;
		state.currentUser = payload;
		state.isLoggedIn = true;
	},
	[mutationTypes.getCurrentUserFailure](state) {
		state.isLoading = false;
		state.isLoggedIn = false;
		state.currentUser = null;
	},

	[mutationTypes.updateCurrentUserStart]() {},
	[mutationTypes.updateCurrentUserSuccess](state, payload) {
		state.currentUser = payload;
	},
	[mutationTypes.updateCurrentUserFailure]() {}
	
}

const actions = {
	//action register
	[actionTypes.register](context, credentials) {
		return new Promise(resolve => {
			context.commit(mutationTypes.registerStart);
			authApi
				.register(credentials)
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
					context.commit(
						mutationTypes.registerFailure,
						result.response.data.errors
					);
				})
		});
		// setTimeout(() => {
		// 	context.commit('registerStart');
		// }, 1000)
	},

	//action login
	[actionTypes.login](context, credentials) {
		return new Promise(resolve => {
			context.commit(mutationTypes.loginStart)
			authApi.login(credentials)
				.then(response => {
					//commit mustation/change state
					context.commit(mutationTypes.loginSuccess, response.data.user);

					setItem('accessToken', response.data.user.token);
					resolve(response.data.user);
				})
				.catch(result => {
					context.commit(
						mutationTypes.loginFailure,
						result.response.data.errors
					)
				})
		});
	},

	//action user
	[actionTypes.getCurrentUser](context) {
		return new Promise(resolve => {
			context.commit(mutationTypes.getCurrentUserStart);
			authApi.getCurrentUser()
				.then(response => {
					//commit mustation/change state
					context.commit(mutationTypes.getCurrentUserSuccess, response.data.user);
					resolve(response.data.user);
				})
				.catch(() => {
					context.commit(mutationTypes.getCurrentUserFailure);
				})
		});
	},

	//action update user
	[actionTypes.updateCurrentUser](context, { currentUserInput }) {
		return new Promise(resolve => {
			context.commit(mutationTypes.updateCurrentUserStart);
			authApi
				.updateCurrentUser(currentUserInput)
				.then(user => {
					//commit mustation/change state
					context.commit(mutationTypes.updateCurrentUserSuccess, user);
					resolve(user);
				})
				.catch(result => {
					context.commit(
						mutationTypes.updateCurrentUserFailure,
						result.response.data.errors
					);
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