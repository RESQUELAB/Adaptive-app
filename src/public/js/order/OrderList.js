class OrderList {
	orders = []

	static LS_ORDERS = 'app-orders'

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
		let profile = new Profile()
		let data = JSON.parse(localStorage.getItem(OrderList.LS_ORDERS))

		this.orders = []

		if (data != null) {
			for (let o of data) {
				// Ensure clientData and paymentData are initialized
				o.clientData = profile.userInfo.clientData || {};
				o.paymentData = profile.userInfo.paymentData || {};
				o.shipmentData = profile.userInfo.shipmentData || {};
				o.summary = o.summary || {};
                o.summary.orderDate = new Date()
                o.summary.arrivalDate = new Date(o.summary.arrivalDate)
				let orderDate = new Date(o.summary.orderDate);
				let arrivalDate = new Date(orderDate);
				arrivalDate.setDate(orderDate.getDate() + 3);
				o.summary.arrivalDate = arrivalDate;
				this.orders.push(new OrderModel(o))
			}
		}
		this.save()
	}

	save() {
		localStorage.setItem(OrderList.LS_ORDERS, JSON.stringify(this.orders))
	}
}