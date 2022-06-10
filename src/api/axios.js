import axios from 'axios';
import { getItem } from '@/helpers/persistanceStorage';

axios.defaults.baseURL = 'https://conduit.productionready.io/api';

axios.interceptors.request.use(config => {
	const token = getItem('accessToken');
	const authorizationToken = token ? `Token ${token}` : '';
	config.header.Aithorization = authorizationToken;
	// console.log('autorizationToken', authorizationToken);

	return config;
})

export default axios;