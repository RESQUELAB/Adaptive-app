var controller = new CatalogController()
controller.render()
controller.setSlider(controller.filter.minPrice, controller.filter.maxPrice)
controller.filter.applyFilters()

translateTexts()