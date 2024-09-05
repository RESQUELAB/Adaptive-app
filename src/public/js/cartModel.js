const defaultCart = []

class CartModel {
	LS_KEY = 'cart-articles'
	constructor() {
		this.load()
		if (this.data == null) {
			this.reset()
		}
	}

	setHeader() {
		$('#basket_counter').text(this.count())
	}

	count() {
		return this.data.length
	}

	/**
	 * Adds an article to the cart
	 * @param {string} id article's id
	 * @param {number} q article's quantity
	 * @param {object} variations variations options: {variationType1: variationValue1, ...}
	 */
	add(id, q, variations) {
		if (!check(articlesData).has(id)) return
		if (!check(variations).isObject()) return

		this.data = array(this.data).pushNew({"id": id, "quantity": q, "variations": variations})

		this.update()
	}

	setQ(line, q) {
		this.data[line].quantity = q
		this.update()
		this.save()
	}

	delLine(n) {
		this.data = array(this.data).removeIndex(n)
		this.removeZeroQuantity()
		this.update()
	}

	calculateTotal() {
		this.total = 6 // Default shipping cost

		for (let line of this.data) {
			let article = articlesData[line.id]
			this.total += article.price * line.quantity
		}
	}

	update() {
		this.calculateTotal()
		this.save()
		this.setHeader()
	}

	save() {
		localStorage.setItem(this.LS_KEY, JSON.stringify(this.data))
		this.toSave = false
	}

	load() {
		this.data = JSON.parse(localStorage.getItem(this.LS_KEY))
		if (this.data == null) {
			this.data = defaultCart
			this.toSave = true
		}

		this.removeZeroQuantity()
		this.calculateTotal()
		if (this.toSave) this.save()
	}

	removeZeroQuantity() {
		let data = this.data
		let startingLength = data.length

		function firstZeroQIndex() {
			for (let i in data) {
				if (data[i].quantity == 0)
					return i
			}
		}

		let zeroqindex = (Number)(firstZeroQIndex())
		this.data = array(data).removeIndex(zeroqindex)

		if (this.data.length != startingLength) {
			this.removeZeroQuantity()
			this.toSave = true
		}
	}

	reset() {
		this.data = defaultCart
		this.update()
	}
}

let cart = new CartModel()