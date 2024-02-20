const defaultFavourites = []

class FavController {
	LS_KEY = 'favourite-articles'
	constructor() {
		this.load()
		if (this.data == null) {
			this.reset()
		}
	}

	setHeader() {
		$('#favorites_counter').text(this.count())
	}

	isFav(id) {
		return array(this.data).has(id)
	}

	count() {
		return this.data.length
	}

	addFav(id) {
		if (!check(articlesData).has(id)) return
		this.data = array(this.data).pushNew(id)
		this.save()
		this.setHeader()
	}

	delFav(id) {
		if (!check(articlesData).has(id)) return
		this.data = array(this.data).remove(id)
		this.save()
		this.setHeader()
	}

	load() {
		this.data = JSON.parse(localStorage.getItem(this.LS_KEY))
	}

	save() {
		localStorage.setItem(this.LS_KEY, JSON.stringify(this.data))
	}

	reset() {
		this.data = defaultFavourites
		this.save()
	}

	getHeartHtml(id) {
		let favourite = this.isFav(id)
		return `<div class="heart-container"><svg targetArticle="${id}" class="heart${favourite? '' : ' empty'}">
			<path xmlns="http://www.w3.org/2000/svg" d="M7.5 1.2C9.2 -0.400001 11.9 -0.400001 13.6 1.3C15.1 2.9 15.2 5.3 13.8 7L13.7 7.2L7.9 13C7.8 13.1 7.7 13.1 7.6 13.2H7.4H7.3C7.2 13.2 7.1 13.2 7 13.1L6.9 13L1.1 7.2C-0.5 5.4 -0.3 2.7 1.5 1.1C3.2 -0.300001 5.6 -0.300001 7.2 1.2L7.3 1.3L7.5 1.2Z"></path>
		</svg></div>`
	}

	setupFavouriteTogglerListeners() {
		$('svg.heart', this.catalogPanel).click(function() {
			let e = $(this)
			let t = e.attr('targetarticle')
			let empty = e.hasClass('empty')

			// Empty heart, add to favs
			if (empty) {
				e.removeClass('empty')
				favs.addFav(t)
			}
			else {
				e.addClass('empty')
				favs.delFav(t)
			}
		})
	}
}

let favs = new FavController()