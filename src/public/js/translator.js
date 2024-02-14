/**
 * This file is loaded via the <script> tag in the index.html file
 */
const defaultLang = "es";
const acceptedLang = ["en", "es"];
var texts = {};
let lang = null;

function getLang() {
    if (lang == null) {
        lang = document.body.getAttribute("lang");
        if (lang == null || acceptedLang.indexOf(lang) < 0) {
            lang = defaultLang;
        }
    }
    return lang;
}

function getText(args) {
    args = args.split(":")
    let ret = null

    // Number translation is the same number
    if (check((Number)(args[0])).isNumber())
        return args[0]

    try {
        ret = texts[args[0]][getLang()]
    }
    catch(e) {
        console.log("Error looking a translation for string: " + args[0])
        return '###'
    }
    
    
    if (args[1]) {
        switch (args[1]) {
            case "1c": // 1st capitalized
                ret = ret.charAt(0).toUpperCase() + ret.slice(1)
                break
            case "ac": // all capitalized
                ret = ret.toUpperCase()
                break
        }
    }
    return ret
}

function translateTexts(l, inside) {
    if (l) {lang = l}
    let elems = inside? $('[textId]', inside) : $('[textId]')

    for (let e of elems) {
        let translation = getText(e.getAttribute('textId'))

        // Case of inputs is different
        if (e.tagName == 'INPUT') {
            e.value = translation
            continue
        }

        e.textContent = translation
    }
}

/**
 * Push a new entry into the translations
 * @param {string} id Identifier of the text
 * @param {string | object } data Translation/s of the text,
 *      string or object: {"lang1": "text1", "lang2": "text2"...}
 */
function pushText(id, data) {
    let o = {}
    if (check(data).isNotEmptyString()) {
        o[id] = {'en': data}
    }
    else {
        o[id]={}
        for (let lang in data)
            o[id][lang] = data[lang]
    }

    addTexts(o)
}

function addTexts(t) {$.extend(texts, t);}