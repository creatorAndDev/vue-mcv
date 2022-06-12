<template>
	<div>
		<div v-if="isLoading">Loading...</div>
		<div v-if="error">Something bad happend</div>
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
				:url="baseUrl"
				:current-page="currentPage"
			/>
		</div>
	</div>
</template>

<script>
import {mapState} from 'vuex'
//query-string
import {stringify, parseUrl} from 'query-string'

import {actionTypes} from '@/store/modules/feed'
import McvPagination from '@/components/Pagination'
import {limit} from '@/helpers/vars.js'

export default {
	name: 'McvFeed',
	components: {
		McvPagination
	},
	props: {
		apiUrl: {
			type: String,
			required: true
		}
	},
	computed: {
		...mapState({
			isLoading: state => state.feed.isLoading,
			feed: state => state.feed.data,
			error: state => state.feed.error
		}),
		limit() {
			return limit;
		},
		baseUrl() {
			// console.log('baseUrl', this.$route);
			return this.$route.path;
		},
		currentPage() {
			// console.log('currentPage', this.$route);
			return Number(this.$route.query.page || '1');
		},
		offset() {
			return this.currentPage * limit - limit;
		}
	},
	watch: {
		currentPage() {
			console.log('currentPage change');
			this.fetchFeed();
		}
	},
	mounted() {
		console.log('init feed');
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
			const apiUrlWithParams = `${parsedUrl.url}?${stringifyParams}`;
			console.log(apiUrlWithParams);
			this.$store.dispatch(actionTypes.getFeed, {apiUrl: apiUrlWithParams});
		}
	}
}
</script>