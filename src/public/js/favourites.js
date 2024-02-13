var controller = new CatalogController()

controller.filter.isFav = true
controller.setGridSize(1)
controller.filter.applyFilters()
controller.setSlider(controller.filter.minPrice, controller.filter.maxPrice)

translateTexts()