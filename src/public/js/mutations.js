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
            }

            if (name == 'language') {
                if (value == 'en') translateTexts('en')
                if (value == 'es') translateTexts('es')
            }

            if (name == 'display') {
                if (value == 'list')  controller.setGridSize(1)
                if (value == 'grid')  controller.setGridSize(4)
            }
        }
    }

    setDarkTheme() {
        $('.full-container').addClass('darkTheme')
        $('.full-container').removeClass('lightTheme')
    }
    
    setLightTheme() {
        $('.full-container').addClass('lightTheme')
        $('.full-container').removeClass('darkTheme')
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
            display: 'list'
        }
    }
}

var mc = new MutationController()