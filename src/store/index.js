import Vue from 'vue'
import Vuex from 'vuex'

//modules import
import auth from '@/store/modules/auth.js'
import feed from '@/store/modules/feed.js'
import popularTags from '@/store/modules/popularTags.js'
import article from '@/store/modules/article.js'
import createArticle from '@/store/modules/createArticle.js'
import editArticle from '@/store/modules/editArticle.js'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {},
	mutations: {},
	actions: {},
	modules: {
		auth,
		feed,
		popularTags,
		article,
		createArticle,
		editArticle
	}
})
