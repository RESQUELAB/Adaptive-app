class CatalogController {
	constructor() {
		this.rendered = false
		this.gridSize = 1
		this.menu_type = "line"
		this.catalogPanel = $('.full-container > .catalog')
		this.page = 1
		if (this.catalogPanel.length == 0) this.catalogPanel = null

		this.filtersPanel = $('.full-container > .filters')
		if (this.filtersPanel.length == 0) this.filtersPanel = null

		this.parseArticles()

		this.renderFilters()
		this.setGridSize(this.gridSize)
	}

	setGridSize(size) {
		if (!check(size).isInt() || size < 1 || size > 5) return
		if (!this.catalogPanel) return

		this.gridSize = size
		this.catalogPanel.attr('class', 'grid-border catalog catalog-' + size + 'cols')

		this.setResultsNumber()
		this.maxArticlesPerPage = Math.min(this.filter.filteredArticles.length, 20)
		this.maxArticlesPerPage -= this.resultsNumber % this.gridSize


		if (this.rendered)
			this.render()
	}

	changeFilters(name, value){
		console.log("CHANGING THE FILTER, MUTATION", name, " . ", value)
		if(name == "menu_type"){
			this.filter.menuType = value

			// Regenerate the categories HTML using the updated menu type
			let newInnerHtml = this.filter.getCategoriesHtml()

			// Replace only the inner HTML of the existing categories box
			document.querySelector('#id_categories .inner-content').innerHTML = newInnerHtml;
			translateTexts()
		}
	}

	setResultsNumber() {
		// 20 articles is the maximum for all modes
		this.resultsNumber = Math.min(this.filter.filteredArticles.length, 30)

		// Adjust to a number that can fit in the grid size
		//this.resultsNumber -= this.resultsNumber % this.gridSize
	}

	parseArticles() {
		this.articles = []

		for (let articleId in articlesData)
			this.articles.push(new Article(articleId, articlesData[articleId]))

		this.filter = new Filter(this.articles, this)
	}

	getFavouriteCount() {
		let n = 0
		for (let a of this.articles) if (a.favourite) n++
		return n
	}

	getResultsHtml() {
		let maxArticles = Math.min(20, this.articles.length)
		maxArticles -= maxArticles % this.gridSize

		return `<div class="results">
			<span textId="results_found_0:1c"></span>
			<span>${this.resultsNumber}</span>
			<span textId="results_found_1"></span>
			<div class="aright">
				<span textId="order_by:1c"></span>
				<select>
					<option textId="relevance:1c"></option>
					<option textId="price:1c"></option>
				</select>
			</div>
		</div>`
	}

	getArticleById(id) {
		for (let a of this.articles) {
			if (a.id == id) return a
		}
		return null
	}

	getArticlesHtml() {
		let maxArticles = this.resultsNumber

		let s = ''
		let n = 0
		for (let a of this.filter.filteredArticles) {
			if (++n > maxArticles) break
			a = this.getArticleById(a)
			s += a.toHtml() + '\n'
		}

		return s
	}

	getPaginationHtml() {
		return `<div class="pagination">Página 1 de 1.</div>`
	}

	setSlider(min, max) {
		$(function () {
			$("#slider-range").slider({
				range: true,
				min: min,
				step: 5,
				max: max,
				values: [min, max],
				slide: function (event, ui) {
					let min = (Number)(ui.values[0])
					let max = (Number)(ui.values[1])

					$("#price_filter #price_min").text(min + "€")
					$("#price_filter #price_max").text(max + "€")

					controller.filter.minPrice = min
					controller.filter.maxPrice = max
					controller.filter.applyFilters()
				}
			});
			$("#price_filter #price_min").text($("#slider-range").slider("values", 0) + "€");
			$("#price_filter #price_max").text($("#slider-range").slider("values", 1) + "€");
		});
	}

	renderFilters() {
		if (!this.filtersPanel) return
		this.filtersPanel.html(this.filter.getHtml())
		this.filter.setupListeners()
	}

	render() {
		this.catalogPanel.html(
			this.getResultsHtml() +
			this.getArticlesHtml() +
			this.getPaginationHtml()
		)
		favs.setupFavouriteTogglerListeners()


		translateTexts(null, this.catalogPanel)

		this.rendered = true
	}
}

class Filter {
	constructor(articles, controller) {
		let cats = (new URL(document.location)).searchParams.get('cat')
		cats = cats ? cats.split(',') : uniqueCategories

		this.controller = controller
		this.selectedCategories = cats
		this.menuType = "default"
		this.filteredArticles = []
		this.maxPrice = 0
		this.minPrice = 9999999999
		this.variations = {}
		this.categories = []
		this.stocks = []
		this.shipmentTypes = []
		this.minStars = 9
		this.maxStars = 0
		this.isFav = false

		// Custom filters
		this.inStock = false
		this.fastShipment = false

		this.parseArticles(articles)
		this.allArticles = this.filteredArticles
	}

	search_by_name(name) {
		let lang = getLang();
		if (typeof lang === 'undefined') {
			lang = 'es';
		}
		let input = document.getElementById("search_input").value
		let filtered = []
		for (let aID of this.allArticles) {
			let a = articlesData[aID]
			if ((a.title[lang]).toLowerCase().includes(input.toLowerCase())) {
				filtered.push(aID)
			}
		}
		this.filteredArticles = filtered
		this.controller.setResultsNumber()
		this.controller.render()
		translateTexts()
	}

	readFilters() {
		let v = this.variations = {}
		$('input[name^="filter_"]:checked').each(function () {
			let e = $(this)
			let filter = e.attr('name').split('_')[1]
			let value = e.attr('name').split('_')[2]

			obj(v).newProperty(filter, [])
			array(v[filter]).pushNew(value)
		})
	}

	applyFilters() {
		this.readFilters()

		let filtered = []
		for (let aID of this.allArticles) {
			let a = articlesData[aID]
			if (a.price < this.minPrice) continue
			if (a.price > this.maxPrice) continue

			if (a.stars < this.minStars) continue
			if (a.stars > this.maxStars) continue
			let cont = false
			for (let filter in this.variations) {
				if (!check(a.variations).has(filter)) {
					cont = true
					break
				}
				if (!array(a.variations[filter].map(String)).hasOne(this.variations[filter])) {
					cont = true
					break
				}
			}
			if (cont) continue
			if (!array(this.selectedCategories).hasOne(a.categories)) continue
			if (this.isFav && !favs.isFav(aID)) continue

			// Custom filters
			if (this.inStock && a.stock == 0) continue
			if (this.fastShipment && a.shipment == 0) continue
			filtered.push(aID)
		}
		this.filteredArticles = filtered

		this.controller.setResultsNumber()
		this.controller.render()
		translateTexts()
	}

	parseArticles(articles) {
		for (let article of articles) {
			this.filteredArticles.push(article.id)
			this.maxPrice = Math.max(article.price, this.maxPrice)
			this.minPrice = Math.min(article.price, this.minPrice)

			for (let variation in article.variations) {
				obj(this.variations).newProperty(variation, [])
				array(this.variations[variation]).extend(article.variations[variation])
			}

			array(this.categories).extend(article.categories)
			array(this.stocks).pushNew(article.stock)
			array(this.shipmentTypes).pushNew(article.shipment)

			this.minStars = Math.min(this.minStars, article.stars)
			this.maxStars = Math.max(this.maxStars, article.stars)
		}

		if (this.variations.sizes)
			this.variations.sizes = this.variations.sizes.sort()
	}

	getHtml() {
		let html = ''

		// Categories
		html += this.getFilterHtml('categories:1c', this.getCategoriesHtml())

		// Price
		html += this.getFilterHtml('price:1c', '<div id="price_filter"><span id="price_min"></span><span id="price_max"></span><div id="slider-range"></div></div>')

		html += this.getVariationsHtml()

		// With stock
		html += this.getFilterHtml('others:1c', `
			<label>
				<input type="checkbox"/>
				<span textId="with_stock:1c"></span>
			</label>
			<label>
				<input type="checkbox"/>
				<span textId="rapid_shipment:1c"></span>
			</label>`)


		return html
	}

	getVariationsHtml() {
		let html = ''
		for (let variation in this.variations) {
			let s = ''
			for (let opt of this.variations[variation]) {
				s += `
				<label>
				  <input type="checkbox" name="filter_${variation}_${opt}" value="${opt}">
				  ${check(opt).isNumber()
						? `<span class="choice">${opt}</span>`
						: `<span class="choice" textId="${opt}Choice:1c"></span>`
					}
				</label>
			  `;
			}
			html += this.getFilterHtml(`variation_${variation}:1c`, s)
		}
		return html
	}

	setupListeners() {
		let that = this
		$('input[name^="filter_"]').on('click', function () {
			that.applyFilters()
		})
		$('#search_input').on('keyup', function () {
			that.search_by_name()
		})
	}

	getFilterHtml(titleId, innerHtml) {
		let div_id = titleId
		if (titleId == "categories:1c"){
			div_id = "categories"
		}
		return `<div id="id_${div_id}" class="box">
		<div class="title" textId="${titleId}"></div>
		<div class="inner-content">
            ${innerHtml}
        </div>
		</div>`
	}

	getCategoriesHtml() {
		let s = ''
		console.log("TEST CATEGORIES HTML:: ", this.menuType)
		switch (this.menuType) {
			case 'dropdown':
				s = `<select onchange="window.location.href='./catalog.html?cat='+this.value">
					<option>Select a category</option>`;
				for (let c of this.categories) {
					s += `<option value="${c}">
					${c}
					</option>`;
				}
				s += `</select>`;
				break;
			
			case 'accordion':
				for (let c of this.categories) {
					s += `<div class="accordion-item">
						<a href="./catalog.html?cat=${c}" textId="category_${c}:1c">${c}</a>
						</div>`;
				}
				break;
	
			case 'tags':
				for (let c of this.categories) {
					s += `<span class="chip">
						<a href="./catalog.html?cat=${c}" textId="category_${c}:1c">${c}</a>
						</span>`;
				}
				break;
	
			case 'checkboxes':
				for (let c of this.categories) {
					s += `<div class="category-item">
						<input type="checkbox" id="${c}" name="${c}">
						<label for="${c}">${c}</label>
						</div>`;
				}
				break;
	
			case 'horizontal-scroll':
				s += `<div class="horizontal-scroll">`;
				for (let c of this.categories) {
					s += `<a href="./catalog.html?cat=${c}" class="scroll-item" textId="category_${c}:1c">${c}</a>`;
				}
				s += `</div>`;
				break;
	
			default:
				// Default line display
				for (let c of this.categories) {
					s += `<div class="line"><a href="./catalog.html?cat=${c}" textId="category_${c}:1c"></a></div>`;
				}
		}
		return s;
	}

	
	

	// getCategoriesHtml() {
	// 	let s = ''
	// 	for (let c of this.categories)
	// 		//s += `<div class="line">${array(this.selectedCategories).has(c)? '>' : ''}<a href="./catalog.html?cat=${c}" textId="category_${c}:1c"></a></div>`
	// 		s += `<div class="line"><a href="./catalog.html?cat=${c}" textId="category_${c}:1c"></a></div>`
	// 	return s
	// }
}

class Article {
	constructor(id, data) {
		this.id = id
		this.setTitle(data.title)
		this.setDescription(data.description)
		this.variations = data.variations
		this.categories = data.categories
		this.images = data.images
		this.stock = data.stock
		this.shipment = data.shipment_type
		this.price = data.price
		this.stars = Math.round(data.stars)
		this.favourite = favs.isFav(this.id)
	}

	setTitle(title) {
		this.title = title
	}

	setDescription(desc) {
		this.description = desc
	}

	getFirstImageUrl() {
		return this.images[0]
	}

	getStarRatingHtml() {
		let n = Math.round(this.stars)
		let s = ''
		for (let i = 0; i < n; i++)
			s += '<svg class="star"><path xmlns="http://www.w3.org/2000/svg" d="M7.641.781l1.735 4.106 4.441.382c.308.027.433.411.199.613l-3.368 2.918 1.009 4.341c.07.302-.257.539-.522.379l-3.816-2.302-3.816 2.302c-.265.16-.591-.078-.522-.379l1.009-4.341-3.369-2.919c-.234-.202-.109-.587.199-.613l4.441-.382 1.735-4.105c.12-.286.524-.286.645 0z"></path></svg>\n'
		n = 5 - n
		for (let i = 0; i < n; i++)
			s += '<svg class="star empty"><path xmlns="http://www.w3.org/2000/svg" d="M7.641.781l1.735 4.106 4.441.382c.308.027.433.411.199.613l-3.368 2.918 1.009 4.341c.07.302-.257.539-.522.379l-3.816-2.302-3.816 2.302c-.265.16-.591-.078-.522-.379l1.009-4.341-3.369-2.919c-.234-.202-.109-.587.199-.613l4.441-.382 1.735-4.105c.12-.286.524-.286.645 0z"></path></svg>\n'

		return s
	}

	toHtml() {
		return `
		<div class="catalog-article">
			<a href="product.html?articleId=${this.id}">
				<img src="./img/articles/${this.getFirstImageUrl()}">
			</a>
			<div class="data">
				<a href="product.html?articleId=${this.id}">
					<span class="title" textId="${this.id}_title"></span>
				</a>
				<div class="star_rating">
					${this.getStarRatingHtml()}
					<span class="score">${this.stars}/5</span>
				</div>
				<span class="price">${this.price.toFixed(2).replace('.', ',')}<sup>€</sup></span>
			</div>
			${favs.getHeartHtml(this.id)}
		</div>`
	}
}