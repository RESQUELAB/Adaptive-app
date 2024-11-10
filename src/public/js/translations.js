(function() {
    let newTexts = {
        "profile": {
            "en": "profile",
            "es": "perfil"
        },
        "basket": {
            "en": "cart",
            "es": "carrito"
        },
        "favorites": {
            "en": "favorites",
            "es": "favoritos"
        },
        "continueShopping": {
            "en": "continue shopping",
            "es": "seguir comprando"
        },
        "reviews": {
            "en": "reviews",
            "es": "reseñas"
        },
        "search": {
            "en": "search",
            "es": "buscar"
        },
        "results_found_0": {
            "en": "found ",
            "es": "se han encontrado "
        },
        "results_found_1": {
            "en": " results.",
            "es": " resultados."
        },
        "order_by": {
            "en": "order by:",
            "es": "ordenar por:"
        },
        "all": {
            "en": "all",
            "es": "todos"
        },
        "filters": {
            "en": "filters",
            "es": "filtros"
        },
        "price": {
            "en": "price",
            "es": "precio"
        },
        "relevance": {
            "en": "relevance",
            "es": "relevancia"
        },
        "sizes": {
            "en": "sizes",
            "es": "tallas"
        },
        "categories": {
            "en": "categories",
            "es": "categorias"
        },
        "category_sneakers": {
            "en": "sneakers",
            "es": "deportivas"
        },
        "category_football": {
            "en": "football",
            "es": "fútbol"
        },
        "category_trail": {
            "en": "trail",
            "es": "trail"
        },
        "category_hiking": {
            "en": "hiking",
            "es": "senderismo"
        },
        "category_urban": {
            "en": "urban",
            "es": "urbanas"
        },
        "category_running": {
            "en": "running",
            "es": "running"
        },
        "category_mountain": {
            "en": "mountain",
            "es": "Montaña"
        },
        "category_casual": {
            "en": "casual",
            "es": "casual"
        },
        "category_sandals": {
            "en": "sandals",
            "es": "sandalias"
        },
        "category_portugal": {
            "en": "Portugal",
            "es": "Portugal"
        },
        "category_francia": {
            "en": "France",
            "es": "Francia"
        },
        "category_japon": {
            "en": "Japan",
            "es": "Japon"
        },
        "category_holanda": {
            "en": "Netherlands",
            "es": "Holanda"
        },
        "category_espana": {
            "en": "Spain",
            "es": "España"
        },
        "category_programming": {
            "en": "programming",
            "es": "programación"
        },
        "category_web_development": {
            "en": "web development",
            "es": "desarrollo web"
        },
        "category_data_science": {
            "en": "data science",
            "es": "ciencia de datos"
        },
        "category_ai": {
            "en": "Artificial intelligence",
            "es": "Inteligencia Artificial"
        },
        
        "category_mobile": {
            "en": "mobile development",
            "es": "desarrollo para móviles"
        },
        
        "category_cybersecurity": {
            "en": "cybersecurity",
            "es": "ciberseguridad"
        },
        "category_design": {
            "en": "graphic design",
            "es": "diseño gráfico"
        },
        "category_game_dev": {
            "en": "game development",
            "es": "desarrollo de videojuegos"
        },
        
        "category_blockchain": {
            "en": "blockchain",
            "es": "blockchain"
        },
        
        "category_healthcare": {
            "en": "healthcare",
            "es": "sector salud"
        },

        "category_seo": {
            "en": "seo",
            "es": "seo"
        },

        "category_finance": {
            "en": "finance",
            "es": "finanzas"
        },

        "category_project_management": {
            "en": "project management",
            "es": "gestión de proyectos"
        },
        "category_cloud": {
            "en": "cloud",
            "es": "la nube"
        }, 
        "category_devops": {
            "en": "devops",
            "es": "devops"
        },



        "category_ml": {
            "en": "machine learning",
            "es": "machine learning"
        },
        "category_marketing": {
            "en": "marketing",
            "es": "marketing"
        },
        "category_big_data": {
            "en": "Big Data",
            "es": "Big Data"
        },
        
        "variation_sizes": {
            "en": "sizes",
            "es": "tallas"
        },
        "variation_colors": {
            "en": "colors",
            "es": "colores"
        },
        "variation_duration": {
            "en": "duration",
            "es": "duración"
        },
        "variation_level": {
            "en": "level",
            "es": "nivel"
        },
        "variation_framework": {
            "en": "framework",
            "es": "Framework"
        },
        "variation_begin": {
            "en": "begin",
            "es": "comienzo"
        },
        "whiteChoice": {
            "en": "white",
            "es": "blanco"
        },
        "blueChoice": {
            "en": "blue",
            "es": "azul"
        },
        "blackChoice": {
            "en": "black",
            "es": "negro"
        },
        "pinkChoice": {
            "en": "pink",
            "es": "rosa"
        },
        "orangeChoice": {
            "en": "orange",
            "es": "naranja"
        },
        "greenChoice": {
            "en": "green",
            "es": "verde"
        },
        "redChoice": {
            "en": "red",
            "es": "rojo"
        },
        "purpleChoice": {
            "en": "purple",
            "es": "morado"
        },
        "yellowChoice": {
            "en": "yellow",
            "es": "amarillo"
        },
        "greyChoice": {
            "en": "grey",
            "es": "gris"
        },
        "sandChoice": {
            "en": "sand",
            "es": "arena"
        },
        "beigeChoice": {
            "en": "beige",
            "es": "beige"
        },
        "01/01/24Choice": {
            "en": "01/01/24 00:00",
            "es": "01/01/24 00:00"
        },
        "15/01/24Choice": {
            "en": "15/01/24 00:00",
            "es": "15/01/24 00:00"
        },
        "31/01/24Choice": {
            "en": "31/01/24 00:00",
            "es": "31/01/24 00:00"
        },
        "7dChoice": {
            "en": "7 days",
            "es": "7 días"
        },
        "9dChoice": {
            "en": "9 days",
            "es": "9 días"
        },
        "30dChoice": {
            "en": "30 days",
            "es": "30 días"
        },
        "45dChoice": {
            "en": "45 days",
            "es": "45 días"
        },
        "60dChoice": {
            "en": "60 days",
            "es": "60 días"
        },
        "90dChoice": {
            "en": "90 days",
            "es": "90 días"
        },
        "120dChoice": {
            "en": "120 days",
            "es": "120 días"
        },
        "BeginnerChoice": {
            "en": "Beginner",
            "es": "Principiante"
        },
        "IntermediateChoice": {
            "en": "Intermediate",
            "es": "Intermedio"
        },
        "AdvancedChoice": {
            "en": "Advanced",
            "es": "Avanzado"
        },
        "ReactChoice": {
            "en": "React",
            "es": "React"
        },
        "VueChoice": {
            "en": "Vue",
            "es": "Vue"
        },
        "AngularChoice": {
            "en": "Angular",
            "es": "Angular"
        },
        "PythonChoice": {
            "en": "Python",
            "es": "Python"
        },
        "RChoice": {
            "en": "R",
            "es": "R"
        },
        "FlutterChoice": {
            "en": "Flutter",
            "es": "Flutter"
        },
        "TensorFlowChoice": {
            "en": "TensorFlow",
            "es": "TensorFlow"
        },
        "UnityChoice": {
            "en": "Unity",
            "es": "Unity"
        },
        "C#Choice": {
            "en": "C#",
            "es": "C#"
        },
        "1mChoice": {
            "en": "1 month",
            "es": "1 mes"
        },
        "2mChoice": {
            "en": "2 months",
            "es": "2 meses"
        },
        
        "winter_coats": {
            "en": "winter coats",
            "es": "abrigos"
        },
        "jackets": {
            "en": "jackets",
            "es": "cazadoras"
        },
        "sweaters": {
            "en": "sweaters",
            "es": "sueters"
        },
        "tshirts": {
            "en": "t-shirts",
            "es": "camisetas"
        },
        "shirts": {
            "en": "shirts",
            "es": "camisas"
        },
        "pants": {
            "en": "pants",
            "es": "pantalones"
        },
        "footwear": {
            "en": "footwear",
            "es": "calzado"
        },
        "accesories": {
            "en": "accesories",
            "es": "accesorios"
        },
        "logistics": {
            "en": "logistics",
            "es": "logística"
        },
        "others": {
            "en": "others",
            "es": "otros"
        },
        "with_stock": {
            "en": "in stock",
            "es": "en stock"
        },
        "rapid_shipment": {
            "en": "rapid shipment",
            "es": "envío rápido"
        },
        "keepBuying": {
            "en": "keep buying",
            "es": "seguir comprando"
        },
        "beginSelector": {
            "en":"Begin",
            "es":"Comienzo"
        },
        "durationSelector": {
            "en":"Duration",
            "es":"Duración"
        },
        "levelSelector": {
            "en":"Level",
            "es":"nivel"
        },
        "frameworkSelector": {
            "en":"Framework",
            "es":"Framework"
        },
        "sizesSelector": {
            "en": "EU size",
            "es": "talla EU"
        },
        "colorsSelector": {
            "en": "color",
            "es": "color"
        },
        "quantity": {
            "en": "quantity",
            "es": "cantidad"
        },
        "addToBucket": {
            "en": "add to bucket",
            "es": "añadir al carrito"
        },
        "fastShipment": {
            "en": "fast shipment",
            "es": "envío rápido"
        },
        "normalShipment": {
            "en": "normal shipment",
            "es": "envío normal"
        },
        "noStock": {
            "en": "out of stock",
            "es": "sin stock"
        },
        "inStock": {
            "en": "in stock",
            "es": "en stock"
        },
        "personalData": {
            "en": "personal data",
            "es": "datos personales"
        },
        "paymentData": {
            "en": "payment data",
            "es": "datos de pago"
        },
        "shipmentData": {
            "en": "shipment data",
            "es": "datos de envío"
        },
        "logout": {
            "en": "Log out",
            "es": "Cerrar sesión"
        },        
        "descriptionTitle": {
            "en": "Description",
            "es": "Descripción"
        },
        "lastname": {
            "en": "last name",
            "es": "apellidos"
        },
        "name": {
            "en": "name",
            "es": "nombre"
        },
        "genre": {
            "en": "genre",
            "es": "género"
        },
        "man": {
            "en": "man",
            "es": "hombre"
        },
        "woman": {
            "en": "woman",
            "es": "mujer"
        },
        "other": {
            "en": "other",
            "es": "otro"
        },
        "birthDate": {
            "en": "birth date",
            "es": "fecha de nacimiento"
        },
        "year4": {
            "en": "YYYY",
            "es": "AAAA"
        },
        "email": {
            "en": "email",
            "es": "correo electrónico"
        },
        "phone": {
            "en": "phone",
            "es": "teléfono"
        },
        "newsletterQuestion": {
            "en": "subscribe to the newsletter",
            "es": "subscribirse al boletín de noticias"
        },
        "requiredFields": {
            "en": "required fields",
            "es": "campos requeridos"
        },
        "accept": {
            "en": "accept",
            "es": "aceptar"
        },
        "cancel": {
            "en": "cancel",
            "es": "cancelar"
        },
        "acceptedCards": {
            "en": "we accpet debit and credit cards.",
            "es": "aceptamos tarjetas de crédito y débito."
        },
        "cardOwner": {
            "en": "card owner",
            "es": "titular de la tarjeta"
        },
        "cardNumber": {
            "en": "card number",
            "es": "número de la tarjeta"
        },
        "dueDate": {
            "en": "due date",
            "es": "fecha de vencimiento"
        },
        "cvvcode": {
            "en": "CVV code",
            "es": "código CVV"
        },
        "country": {
            "en": "country",
            "es": "país"
        },
        "postalcode": {
            "en": "postal code",
            "es": "código postal"
        },
        "city": {
            "en": "city",
            "es": "ciudad"
        },
        "roadType": {
            "en": "road type",
            "es": "tipo de vía"
        },
        "namenumberroad": {
            "en": "name and number of the road",
            "es": "nombre y número de la vía"
        },
        "avenue": {
            "en": "avenue",
            "es": "avenida"
        },
        "street": {
            "en": "street",
            "es": "calle"
        },
        "square": {
            "en": "square",
            "es": "plaza"
        },
        "road": {
            "en": "road",
            "es": "carretera"
        },
        "officebox": {
            "en": "post office box",
            "es": "apartado de correos"
        },
        "roadextra": {
            "en": "location extra information",
            "es": "información extra sobre la dirección"
        },
        "confirmPurchase": {
            "en": "confirm purchase",
            "es": "confirmar compra"
        },
        "product": {
            "en": "product",
            "es": "producto"
        },
        "unitPrice": {
            "en": "unit price",
            "es": "precio unidad"
        },
        "amount": {
            "en": "amount",
            "es": "importe"
        },
        "order": {
            "en": "order",
            "es": "pedido"
        },
        "remove": {
            "en": "remove",
            "es": "eliminar"
        },
        "variationIncompleteWarning": {
            "en": "you must select at least one option for each product variant",
            "es": "debes seleccionar al menos una opción para cada variante del producto"
        },
        "outOfStockWarning": {
            "en": "there is no stock for that product. Try again later",
            "es": "no hay stock para ese producto. Vuelva a intentarlo más tarde"
        },
        "productAdded": {
            "en": "products added:",
            "es": "productos añadidos:"
        },
        "carrier": {
            "en": "carrier",
            "es": "transportista"
        },
        "estimatedArrival": {
            "en": "estimated arrival date",
            "es": "fecha estimada de llegada"
        },
        "orderDate": {
            "en": "order date",
            "es": "fecha del pedido"
        },
        "emptyCart": {
            "en": "your shopping cart is empty.",
            "es": "su carrito de la compra está vacío."
        },
        // "": {
        //     "en": "",
        //     "es": ""
        // },
        // "": {
        //     "en": "",
        //     "es": ""
        // },
        // "": {
        //     "en": "",
        //     "es": ""
        // },
        // "": {
        //     "en": "",
        //     "es": ""
        // },
        // "": {
        //     "en": "",
        //     "es": ""
        // },
        // "": {
        //     "en": "",
        //     "es": ""
        // },
        // "": {
        //     "en": "",
        //     "es": ""
        // },
        // "": {
        //     "en": "",
        //     "es": ""
        // },
        // "": {
        //     "en": "",
        //     "es": ""
        // },
        // "": {
        //     "en": "",
        //     "es": ""
        // },
        // "": {
        //     "en": "",
        //     "es": ""
        // },
        // "": {
        //     "en": "",
        //     "es": ""
        // },
        // "": {
        //     "en": "",
        //     "es": ""
        // },
        // "": {
        //     "en": "",
        //     "es": ""
        // },
        // "": {
        //     "en": "",
        //     "es": ""
        // },
        // "": {
        //     "en": "",
        //     "es": ""
        // },
        // "": {
        //     "en": "",
        //     "es": ""
        // },
    }

    addTexts(newTexts)
})()