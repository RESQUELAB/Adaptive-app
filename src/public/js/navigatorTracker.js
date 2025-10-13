// navigatorTracker.js
window.addEventListener('DOMContentLoaded', () => {
    if (window.api && window.api.sendNavigation) {
        const pathname = window.location.pathname.split('/').pop(); 
        const query = window.location.search; 
        const pag = pathname + query;
        window.api.sendNavigation({ page: pag });
    } else {
        console.log("Navigation Info:", window.location.href);
    }
});
