class MutationController {
    constructor() {
        this.LS_KEY = 'sports-mutation'
        this.load()

        let that = this
        $(document).ready(function() {
            for (let mutation in that.mutations) {
                let value = that.mutations[mutation]
                that.mutate(mutation, value)
            }
        })
    }

    mutate(name, value) {
        if (check(this.mutations).has(name)) {
            this.mutations[name] = value
            this.save()

            console.log(name, value)

            if (name == 'theme') {
                if (value == 'dark') this.setDarkTheme()
                if (value == 'light') this.setLightTheme()
                if (value == 'contrast') this.setContrastTheme()
            }

            if (name == 'language') {
                if (value == 'en') translateTexts('en')
                if (value == 'es') translateTexts('es')
            }

            if (name == 'display') {
                if (value == 'list')   controller.setGridSize(1)
                if (value == 'grid2')  controller.setGridSize(2)
                if (value == 'grid3')  controller.setGridSize(3)
                if (value == 'grid4')  controller.setGridSize(4)
                if (value == 'grid5')  controller.setGridSize(5)
            }
            if (name == 'font') this.setFontSize(value)
        }
    }

    setFontSize(value) {
        if (value == "small") document.documentElement.style.setProperty('--base-font-size', '14px');
        if (value == "default") document.documentElement.style.setProperty('--base-font-size', '16px');
        if (value == "big") document.documentElement.style.setProperty('--base-font-size', '22px');
    }

    setDarkTheme() {
        $('.full-container').addClass('darkTheme')
        $('.full-container').removeClass('highContrast')
        $('.full-container').removeClass('lightTheme')
    }
    
    setLightTheme() {
        $('.full-container').addClass('lightTheme')
        $('.full-container').removeClass('darkTheme')
        $('.full-container').removeClass('highContrast')
    }
    
    setContrastTheme() {
        $('.full-container').addClass('highContrast')
        $('.full-container').removeClass('darkTheme')
        $('.full-container').removeClass('lightTheme')
    }

    save() {
        localStorage.setItem(this.LS_KEY, JSON.stringify(this.mutations))
    }

    load() {
        let data = JSON.parse(localStorage.getItem(this.LS_KEY))

        if (data == null) {
            this.loadDefaults()
            this.save()
        }
        else {
            this.mutations = data
        }

    }

    loadDefaults() {
        this.mutations = {
            theme: 'dark',
            language: 'es',
            display: 'list',
            font: "default"
        }
    }
}

var mc = new MutationController()