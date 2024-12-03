class MutationController {
    constructor() {
        this.LS_KEY = 'adaptive-app'
        this.load()

        let that = this
        $(document).ready(function () {
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

            if (name == 'display' && typeof controller !== 'undefined') {
                if (value == 'list') controller.setGridSize(1)
                if (value == 'grid2') controller.setGridSize(2)
                if (value == 'grid3') controller.setGridSize(3)
                if (value == 'grid4') controller.setGridSize(4)
                if (value == 'grid5') controller.setGridSize(5)
            }
            if (name == 'font_size') this.setFontSize(value)
            if (name == 'information' && typeof pageProduct !== 'undefined') pageProduct.setDescriptionVisibility(value)

            if (name == 'category') this.changeCategory(value)
            if (name == 'menu_type' && typeof controller !== 'undefined' ){
                console.log("MENU TYPE: ", name, " - ", value)
                controller.changeFilters(name, value)
            }
        }
    }

    changeCategory(value) {

        $('#full-container').attr('background-image', "../img/logo_" + value + '.png');

        $('#headerLogo').attr('src', "img/logo_" + value + '.png');
        console.log("VALUE ", value)
        if (value == "sports") {
            console.log("IT IS sports")
            $('#headerLogo').attr('style', "width: 100%");
        } else {
            $('#headerLogo').attr('style', "");

        }
        if (window.location.pathname.includes("index")) {
            // Reset localStorage only if on the login page
            console.log("reset localstorage.")
            localStorage.setItem("favourite-articles", JSON.stringify([]))
            localStorage.setItem("cart-articles", JSON.stringify([]))
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
        this.load_all_mutations()
        if (data == null) {
            this.loadDefaults()
            this.save()
        }
        else {
            const missingMutations = Object.keys(this.all_mutations).filter(mutation => !data.hasOwnProperty(mutation));
    
            if (missingMutations.length > 0) {
                missingMutations.forEach(mutation => {
                    data[mutation] = this.all_mutations[mutation][0];
                });
            }
    
            this.mutations = data; 
        }
    }

    loadDefaults() {
        this.mutations = {
            theme: 'light',
            language: 'es',
            display: 'list',
            font_size: "default",
            information: "show",
            category: "sports",
            menu_type: "line",
        }
    }

    load_all_mutations() {
        this.all_mutations = {
            "display": ["list", "grid2", "grid3", "grid4", "grid5"],
            "theme": ["light", "dark"],
            "information": ["show", "partial", "hide"],
            "font_size": ["small", "default", "big"],
            "menu_type": ["line", "dropdown"]
        }
    }
}

var mc = new MutationController()