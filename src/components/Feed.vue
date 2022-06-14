<template>
	<div>
		<mcv-loading v-if="isLoading" />
		<mcv-error-message v-if="error" />
		
		<div v-if="feed">
			<div 
				class="article-preview"
				v-for="(article, index) in feed.articles" 
				:key="index"
			>
				<div class="article-meta">
					<router-link :to="{
							name: 'userProfile', 
							params:{slug: article.author.username}
						}">
						<img :src="article.author.image" alt="">
					</router-link>
					<div class="info">
						<router-link :to="{
								name: 'userProfile',
								params:{slug: article.author.username}
							}"
							class="author"
						>
							{{article.author.username}}
						</router-link>
						<span class="date">
							{{article.createdAt}}
						</span>
					</div>
					<div class="pull-xs-right">
						ADD TO FAVORITES
					</div>
				</div>
				<router-link :to="{
						name: 'article', 
						params: {slug: article.slug}
					}"
					class="preview-link"
				>
					<h1>{{article.title}}</h1>
					<p>{{article.description}}</p>
					<span>Read more...</span>
					TAG LIST
				</router-link>
			</div>
			<mcv-pagination 
				:total="feed.articlesCount"
				:limit="limit"
				:current-page="currentPage"
				:url="baseUrl"
			/>
		</div>
	</div>
</template>

<script>
import {mapState} from 'vuex'

import {actionTypes} from '@/store/modules/feed'
import McvPagination from '@/components/Pagination'
import {limit} from '@/helpers/vars.js'
import McvLoading from '@/components/Loading'
import McvErrorMessage from '@/components/ErrorMessage'

// query-string
import {stringify, parseUrl} from 'query-string'

export default {
	name: 'McvFeed',
	components: {
		McvPagination,
		McvLoading,
		McvErrorMessage
	},
	props: {
		apiUrl: {
			type: String,
			required: true
		}
	},
	// data() {
	// 	return {
	// 		// total: 500,
	// 		// limit,
	// 		// currentPage: 1,
	// 		url: '/'
	// 	}
	// },
	computed: {
		...mapState({
			isLoading: state => state.feed.isLoading,
			feed: state => state.feed.data,
			error: state => state.feed.error
		}),
		limit() {
			return limit;
		},
		currentPage() {
			// console.log('currentPage', this.$route);
			return Number(this.$route.query.page || '1');
		},
		baseUrl() {
			// console.log('baseUrl: ', this.$route);
			return this.$route.path;
		},
		offset() {
			return this.currentPage * limit - limit;
		}
	},
	watch: {
		currentPage() {
			// console.log('currentPage change');
			this.fetchFeed();
		}
	},
	mounted() {
		// console.log('init feed');
		// this.$store.dispatch(actionTypes.getFeed, {apiUrl: this.apiUrl});
		this.fetchFeed();
	},
	methods: {
		fetchFeed() {
			const parsedUrl = parseUrl(this.apiUrl);
			const stringifyParams = stringify({
				limit,
				offset: this.offset,
				...parsedUrl.query
			});
			// console.log('Parse URL: ', parsedUrl, stringifyParams);
			
			const apiUrlWithParams = `${parsedUrl.url}?${stringifyParams}`;
			// console.log('Api with params: ', apiUrlWithParams);

			// this.$store.dispatch(actionTypes.getFeed, {apiUrl: this.apiUrl});
			// console.log('Api URL: ', this.apiUrl);
			
			this.$store.dispatch(actionTypes.getFeed, {apiUrl: apiUrlWithParams});
		}
	}
}
</script>