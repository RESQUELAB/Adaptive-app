class PlatformController {
    constructor() {
        this.uaData = navigator.userAgentData || null;
        this.userAgent = navigator.userAgent;
    }

    getBrowser() {
        if (this.uaData?.brands) {
            const knownBrands = ["Chrome", "Firefox", "Edge", "Opera", "Safari"];
            const match = this.uaData.brands.find(b =>
                knownBrands.some(kb => b.brand.toLowerCase().includes(kb.toLowerCase()))
            );
            if (match) return match.brand;
        }

        const ua = this.userAgent;
        if (/edg/i.test(ua)) return "Edge";
        if (/opr|opera/i.test(ua)) return "Opera";
        if (/chrome|crios/i.test(ua)) {
            if (/brave/i.test(ua)) return "Brave";
            if (/vivaldi/i.test(ua)) return "Vivaldi";
            return "Chrome";
        }
        if (/firefox|fxios/i.test(ua)) return "Firefox";
        if (/safari/i.test(ua) && !/chrome|crios|edg|opr/i.test(ua)) return "Safari";
        return "Desconocido";
    }

    getBrowserVersion() {
        if (this.uaData?.brands) {
            const brand = this.uaData.brands.find(b => b.brand !== "Not)A;Brand");
            return brand?.version || "Desconocido";
        }
        return "Desconocido";
    }

    getOS() {
        const ua = this.userAgent.toLowerCase();
        let name = "Desconocido";
        let version = "Desconocida";
        let architecture = "Desconocida";

        // Plataforma general con userAgentData
        if (this.uaData?.platform) {
            const p = this.uaData.platform.toLowerCase();
            if (p.includes("win")) name = "Windows";
            else if (p.includes("mac")) name = "macOS";
            else if (p.includes("android")) name = "Android";
            else if (p.includes("ios") || p.includes("iphone") || p.includes("ipad")) name = "iOS";
            else if (p.includes("linux")) name = "Linux";
            else name = this.uaData.platform;
        }

        // Versión detallada desde userAgent
        if (ua.includes("windows nt 10.0")) {
            name = "Windows";
            version = "10/11";
        } else if (ua.includes("windows nt 6.3")) {
            name = "Windows";
            version = "8.1";
        } else if (ua.includes("windows nt 6.2")) {
            name = "Windows";
            version = "8";
        } else if (ua.includes("windows nt 6.1")) {
            name = "Windows";
            version = "7";
        } else if (ua.includes("windows nt 5.1")) {
            name = "Windows";
            version = "XP";
        } else if (ua.includes("mac os x")) {
            name = "macOS";
            const match = ua.match(/mac os x (\d+[_\.\d]+)/);
            if (match) version = match[1].replace(/_/g, ".");
        } else if (ua.includes("android")) {
            name = "Android";
            const match = ua.match(/android (\d+(\.\d+)?)/);
            if (match) version = match[1];
        } else if (ua.includes("iphone os") || ua.includes("ipad; cpu os")) {
            name = "iOS";
            const match = ua.match(/os (\d+[_\.\d]+)/);
            if (match) version = match[1].replace(/_/g, ".");
        } else if (ua.includes("linux")) {
            name = "Linux";
        }

        // Arquitectura
        if (ua.includes("x86_64") || ua.includes("win64") || ua.includes("x64")) {
            architecture = "64-bit";
        } else if (ua.includes("aarch64") || ua.includes("arm64") || ua.includes("arm")) {
            architecture = "ARM";
        } else if (ua.includes("i686") || ua.includes("i386")) {
            architecture = "32-bit";
        }

        return { name, version, architecture };
    }

    getScreenInfo() {
        return {
            width: screen.width,
            height: screen.height,
            pixelRatio: window.devicePixelRatio,
            colorDepth: screen.colorDepth
        };
    }

    getConnectionInfo() {
        const conn = navigator.connection || {};
        return conn.effectiveType
            ? {
                type: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt,
                saveData: conn.saveData
            }
            : "Not supported";
    }

    getDeviceType() {
        if (this.uaData?.mobile !== undefined) {
            return this.uaData.mobile ? "Móvil" : "Escritorio";
        }

        const ua = this.userAgent.toLowerCase();

        if (/mobi|android|iphone|ipad|ipod|blackberry|phone/i.test(ua)) return "Móvil";
        if (/tablet|ipad/i.test(ua)) return "Tablet";
        return "Escritorio";
    }

    // motor de navegador
    getEngine() {
        const ua = this.userAgent.toLowerCase();
        if (/edg/i.test(ua)) return "Blink (Edge)";
        if (/opr|opera/i.test(ua)) return "Blink (Opera)";
        if (/chrome|crios/i.test(ua)) return "Blink (Chrome)";
        if (/firefox|fxios/i.test(ua)) return "Gecko";
        if (/safari/i.test(ua) && !/chrome|crios|edg|opr/i.test(ua)) return "WebKit";
        if (/trident|msie/i.test(ua)) return "Trident (IE)";
        return "Desconocido";
    }

    // entorno tecnológico
    getTechnologyStack() {
        const ua = this.userAgent.toLowerCase();
        if (/electron/.test(ua)) return "Electron";
        if (/nwjs/.test(ua)) return "NW.js";
        if (/cordova|phonegap/.test(ua)) return "Cordova";
        if (/reactnative/.test(ua)) return "React Native WebView";
        if (/flutter/.test(ua)) return "Flutter WebView";
        if (/puppeteer|headless|selenium/.test(ua)) return "Automatización";
        if (/webview/.test(ua)) return "WebView";
        return "Navegador Web";
    }

    //agrupador de tecnología
    getTechnology() {
        return {
            engine: this.getEngine(),
            stack: this.getTechnologyStack()
        };
    }

    async getInfo() {
        return {
            browser: {
                name: this.getBrowser(),
                version: this.getBrowserVersion()
            },
            os: this.getOS(),
            //userAgent: this.userAgent,
            language: navigator.language,
            languages: navigator.languages,
            cookiesEnabled: navigator.cookieEnabled,
            online: navigator.onLine,
            cores: navigator.hardwareConcurrency,
            memoryGB: navigator.deviceMemory || "N/A",
            screen: this.getScreenInfo(),
            connection: this.getConnectionInfo(),
            tipoDispositivo: this.getDeviceType(),
            tecnologia: this.getTechnology(), // <-- aquí
            features: {
                serviceWorker: "serviceWorker" in navigator,
                jsEnabled: true
            }
        };
    }
}

var pfc = new PlatformController();
