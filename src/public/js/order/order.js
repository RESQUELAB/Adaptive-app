class OrderListController {
	action = (new URL(document.location)).searchParams.get('action')

	constructor() {
		this.orderList = new OrderList()
		this.orders = this.orderList.orders

		if (this.action == null)
			this.this.action = 'list'
		console.log("testtt..... ", this.action);
		if (this.action == 'create') {
			console.log("hey1 ")
			this.purchase()
			console.log("hey2 ")
			this.action = 'detail'
			this.order = this.orderList.getLast()
			return
		}

		if (this.action == 'detail') {
			this.order = this.orderList.getOrderById((new URL(document.location)).searchParams.get('orderId'))
		}
	}

	purchase() {
		if (cart.data.length == 0) {
			return
		}

		let order = {}
		let profile = new Profile()
		let d = new Date()
		d.setHours(0, 0, 0, 0)

		order.id = (2300001 + this.orders.length).toFixed(0)
		order.shipmentData = profile.userInfo.shipmentData
		order.clientData = profile.userInfo.clientData
		order.paymentData = profile.userInfo.paymentData

		order.summary = {
			status: 1,
			orderDate: d,
			arrivalDate: new Date((Number)(d) + 3 * 1000 * 60 * 60 * 24),
			total: cart.total,
			tax: (cart.total / 1.21) * 0.21
		}

		order.articles = cart.data

		this.orders.push(new OrderModel(order))
		cart.data = []

		cart.setHeader()
		this.orderList.save()
		cart.save()
	}

	render() {
		if (this.action == 'list') this.renderList()
		if (this.action == 'detail') this.renderDetail()
	}

	renderList() {
		$('.orderList').html(`
		<div id="articleList">
		<div class="headers">
			<span>ID</span>
			<span>Cantidad de articulos</span>
			<span>Importe</span>
			<span>Estado</span>
			<span>Pedido realizado el</span>
		</div>
		${this.getOrdersHTML()}
		</div>
		`)
	}

	getOrdersHTML() {
		let html = ''
		let status = {
			0: "Cancelado",
			1: "En progreso",
			2: "Completado"
		}
		let n = 0
		for (let order of this.orders) {
			html += `
			<div class="article" name="${n++}">
				<a href="./order.html?action=detail&orderId=${order.id}">${order.id}</a>
				<span>${order.articles.length}</span>
				<span>${order.summary.total.toFixed(2)}€</span>
				<span>${status[order.summary.status]}</span>
				<span>${order.summary.orderDate.toLocaleDateString()}</span>
			</div>`
		}
		return html
	}

	renderDetail() {
		let o = this.order
		let c = o.clientData
		console.log("----------")
		console.log(o)
		console.log("----------")
		console.log("----------")
		let card = o.paymentData.cardNumber

		let orderHtml = `<div id="orderDetails">
			<h2><span textid="order:1c"></span> <span>#${o.id}</span></h2>
			<div id="articleList">
				<div class="headers">
					<span></span>
					<span textid="product:1c"></span>
					<span textid="unitPrice:1c"></span>
					<span textid="quantity:1c"></span>
					<span textid="amount:1c"></span>
				</div>
				${this.getArticleListHTML()}
			</div>
			
			
			`;

		if (mc.mutations.category !== 'trips') {

			orderHtml += `
			
			<div id="orderSummary">
				<div id="shipmentData">
					<p><span textId="carrier:1c"></span>: SEUR</p>
					<p><span textId="orderDate:1c"></span>: ${o.summary.orderDate.toLocaleDateString()}</p>
					<p><span textId="estimatedArrival:1c"></span>: ${o.summary.arrivalDate.toLocaleDateString()}</p>
				</div>
				<div id="moneySummary">
					<div id="totalMoneyStep1">
						<div>Total artículos (IVA inc.)</div>
						<div>${(o.summary.total - 6).toFixed(2)}€</div>
					</div>
					<div id="shipment">
						<div>Envío y preparación</div>
						<div>6.00€</div>
					</div>
					<div id="taxes">
						<div>Impuestos (21%)</div>
						<div>${o.summary.tax.toFixed(2)}€</div>
					</div>
					<div id="totalMoneyStep2">
						<div>Total (IVA inc.)</div>
						<div>${(o.summary.total).toFixed(2)}€</div>
					</div>
				</div>
			</div>
			`
		}else{
			
			orderHtml += `
			
			<div id="orderSummary">
				<div id="shipmentData">
					<p><span textId="orderDate:1c"></span>: ${o.summary.orderDate.toLocaleDateString()}</p>
				</div>
				<div id="moneySummary">
					<div id="totalMoneyStep1">
						<div>Total artículos (IVA inc.)</div>
						<div>${(o.summary.total - 6).toFixed(2)}€</div>
					</div>
					
					<div id="taxes">
						<div>Impuestos (21%)</div>
						<div>${o.summary.tax.toFixed(2)}€</div>
					</div>
					<div id="totalMoneyStep2">
						<div>Total (IVA inc.)</div>
						<div>${(o.summary.total).toFixed(2)}€</div>
					</div>
				</div>
			</div>
			`
		}
			orderHtml += `
		</div>
		<div id="userData">
			<div id="personalData">
				<h3>Datos personales</h3>
				<p>${c.lastName}, ${c.name}</p>
				<p>
				<!-- <span textId="${this.getRoadTypeString()}">
				-->
				</span> ${o.shipmentData.roadMainInfo} - ${o.shipmentData.roadExtraInfo}</p>
				<p>${o.shipmentData.postalCode} ${o.shipmentData.city}</p>
			</div>
			<div id="paymentData">
				<h3>Datos de pago</h3>
				<p>Método de pago: Tarjeta de débito</p>
				<p>VISA: **** ${card.substring(card.length - 4)}</p>
			</div>
		</div>
			`


		$('.orderList').html(orderHtml)

		$('a.goBack').attr('href', './order.html?action=list').text('< Pedidos')
	}

	getRoadTypeString() {
		let n = this.order.shipmentData.roadType
		switch (n) {
			case 1: return 'avenue'
			case 2: return 'street'
			case 3: return 'square'
			case 4: return 'road'
			case 5: return 'officebox'
		}
	}

	getArticleListHTML() {
		let html = ''
		let n = 0
		for (let line of this.order.articles) {
			let article = articlesData[line.id]
			let amount = line.quantity * article.price
			html += `
			<div class="article" name="${n++}">
				<img src="./img/articles/${article.images[0]}">
				<div class="articleNameAndVariations">
					<span textid="${line.id}_title"></span>
					<div class="variationsText">${this.articleVariationsAsHtml(line)} </div>
				</div>
				<span>${article.price.toFixed(2)}€</span>
				<div class="articleQuantity">${line.quantity}</div>
				<span>${amount.toFixed(2)}€</span>
			</div>`
		}
		return html
	}

	articleVariationsAsHtml(article) {
		let variationsStrings = []
		for (let v in article.variations) {
			let s = ''
			let val = article.variations[v]

			s += `<span textId="${v}Selector"></span> `
			if (check((Number)(val)).isNumber())
				s += `<span>${article.variations[v]}</span>`
			else
				s += `<span textId="${article.variations[v]}Choice"></span>`
			variationsStrings.push(s)
		}
		return variationsStrings.join(', ')
	}
}
let olc = new OrderListController()
olc.render()