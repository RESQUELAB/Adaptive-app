class OrderModel {
	id = null
	shipmentData = {}
	clientData = {}
	paymentData = {}
    summary = {}
	total = 0
    taxes = 0
    shipmentCost = 6
	articles = []


	constructor(order) {
		this.id = order.id 
		this.shipmentData = order.shipmentData
		this.clientData = order.clientData
		this.paymentData = order.paymentData
        this.summary = order.summary
		this.articles = order.articles
		console.log("creating an order!")
	}

	loadByOrderId(id) {
		this.load(orders.getOrderById(id))
	}

	length() {
		return this.articles.length
	}
}