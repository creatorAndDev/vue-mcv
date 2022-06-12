<template>
	<ul class="pagination">
		<li
			v-for="page in pages" 
			:key="page"
			class="page-item"
			:class="{active: currentPage === page}"
		>
			<router-link :to="{path: url, query: {page: page}}" class="page-link">
				{{page}}
			</router-link>
		</li>
	</ul>
</template>

<script>
import {range} from '@/helpers/utils.js'

export default {
	name: 'McvPagination',
	props: {
		total: {
			type: Number,
			required: true
		},
		limit: {
			type: Number,
			required: true
		},
		currentPage: {
			type: Number,
			required: true
		},
		url: {
			type: String,
			required: true
		}
	},
	computed: {
		pages() {
			const pagesCount = Math.ceil(this.total / this.limit);
			console.log(this.total);
			console.log(this.limit);
			console.log(pagesCount);
			return range(1, pagesCount);
			// return range(1, 10);
		}
	}
}
</script>