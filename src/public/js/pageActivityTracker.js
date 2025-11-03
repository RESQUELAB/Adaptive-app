let pageEntryTime = Date.now();
let clickCount = 0;
let scrollUpActionCount = 0;   
let scrollDownActionCount = 0;
let scrollTimeout; 
let totalScrollDistance = 0;
let lastScrollY = window.scrollY;

window.addEventListener('click', () => clickCount++);
window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    
    // Total distance
    const distance = Math.abs(currentY - lastScrollY);
    totalScrollDistance += distance;
    
    //Action count
    clearTimeout(scrollTimeout);
    if (currentY > lastScrollY) {
        // Scroll down
        scrollTimeout = setTimeout(() => {
            scrollDownActionCount++;
        }, 200); 
    } else if (currentY < lastScrollY) {
        // Scroll up
        scrollTimeout = setTimeout(() => {
            scrollUpActionCount++;
        }, 200); 
    }
    
    lastScrollY = currentY;
});

function sendNavigationData() {
    const page = window.location.pathname.split('/').pop() + window.location.search;
    const duration = Math.round((Date.now() - pageEntryTime)/1000);

    const data = {
        path: page,
        durationSeconds: duration,
        numClicks: clickCount,
        
        scroll: { 
            actionsUP: scrollUpActionCount, 
            actionsDOWN: scrollDownActionCount,
            totalDistance: totalScrollDistance 
        }
    };

    if (window.api && window.api.sendNavigation) {
        window.api.sendNavigation(data);
    } else {
        console.log("Navigation Info:", data);
    }
}

window.addEventListener('beforeunload', sendNavigationData);