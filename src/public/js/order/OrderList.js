class OrderList {
	orders = []

	static LS_ORDERS = 'sports-orders'

	constructor() {
		this.load()
	}

	getOrderById(id) {
		for (let order of this.orders)
			if (order.id == id) return order
		return null
	}

    getLast() {
        return this.orders.at(-1)
    }

    length() {
        return this.orders.length
    }

	load() {
		let data = JSON.parse(localStorage.getItem(OrderList.LS_ORDERS))
		this.orders = []

		if (data != null) {
			for (let o of data) {
                o.clientData.birthDate = new Date(o.clientData.birthDate)
                o.paymentData.dueDate = new Date(o.paymentData.dueDate)
                o.clientData.birthDate = new Date(o.clientData.birthDate)
                o.summary.orderDate = new Date(o.summary.orderDate)
                o.summary.arrivalDate = new Date(o.summary.arrivalDate)
				this.orders.push(new OrderModel(o))
			}
		}
		this.save()
	}

	save() {
		localStorage.setItem(OrderList.LS_ORDERS, JSON.stringify(this.orders))
	}
}