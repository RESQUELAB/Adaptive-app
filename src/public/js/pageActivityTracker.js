let pageEntryTime = Date.now();
let clickCount = 0;
let scrollUpCount = 0;
let scrollDownCount = 0;
let lastScrollY = window.scrollY;

// Contadores
window.addEventListener('click', () => clickCount++);
window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (currentY > lastScrollY) scrollDownCount++;
    else if (currentY < lastScrollY) scrollUpCount++;
    lastScrollY = currentY;
});

// Enviar datos
function sendNavigationData() {
    const page = window.location.pathname.split('/').pop() + window.location.search;
    const duration = Math.round((Date.now() - pageEntryTime)/1000);

    const data = {
        page,
        duration,
        clicks: clickCount,
        scroll: { up: scrollUpCount, down: scrollDownCount }
    };

    if (window.api && window.api.sendNavigation) {
        window.api.sendNavigation(data);
    } else {
        console.log("Navigation Info:", data);
    }
}
// Solo enviar al abandonar la página
window.addEventListener('beforeunload', sendNavigationData);