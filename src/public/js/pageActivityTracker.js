let pageEntryTime = Date.now();
let clickCount = 0;
let scrollUpActionCount = 0;
let scrollDownActionCount = 0;
let scrollTimeout;
//let totalScrollDistance = 0;
let lastScrollY = window.scrollY;

const emotionValues = {
    1: 'angry',
    2: 'happy',
    3: 'fear',
    4: 'neutral',
    5: 'sad',
    6: 'surprise',
    7: 'disgust'
}

function getLocalISOTime() {
    const now = new Date();
    const tzo = -now.getTimezoneOffset();
    const dif = tzo >= 0 ? '+' : '-';
    const pad = n => String(Math.floor(Math.abs(n))).padStart(2, '0');

    return (now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + 'T' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()) + dif + pad(Math.floor(Math.abs(tzo) / 60)) + ':' + pad(Math.abs(tzo) % 60));
}

function getEmotion(){
    const keys = Object.keys(emotionValues);
    const rdmKey = keys[Math.floor(Math.random() * keys.length)];
    return emotionValues[rdmKey];
}

let pageEntryTimeISO = getLocalISOTime();
let emotion = getEmotion();

window.addEventListener('click', () => clickCount++);
window.addEventListener('scroll', () => {
    const currentY = window.scrollY;

    // Total distance
    // const distance = Math.abs(currentY - lastScrollY);
    // totalScrollDistance += distance;

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
    const duration = Math.round((Date.now() - pageEntryTime) / 1000);

    const data = {
        path: page,
        entryTime: pageEntryTimeISO,
        durationSeconds: duration,
        numClicks: clickCount,
        userEmotion: emotion,
        scroll: {
            actionsUP: scrollUpActionCount,
            actionsDOWN: scrollDownActionCount,
            //totalDistance: totalScrollDistance 
        }
    };

    if (window.api && window.api.sendNavigation) {
        window.api.sendNavigation(data);
    } else {
        console.log("Navigation Info:", data);
    }
}

window.addEventListener('beforeunload', sendNavigationData);