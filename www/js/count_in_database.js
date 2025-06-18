let audioContextStarted = false;

function initAudio() {
    if (!audioContextStarted) {
        Tone.start();
        audioContextStarted = true;
    }
}

// Your Firebase config (replace with actual values)
const firebaseConfig = {
    authDomain: "saloonvisitors.firebaseapp.com",
    projectId: "saloonvisitors",
    storageBucket: "saloonvisitors.appspot.com",
    messagingSenderId: "374582370155"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Unique visitor counter
async function countVisitor() {
    try {
        // Get client IP (using free API)
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const {ip} = await ipResponse.json();

        // Check if IP exists in database
        const visitorsRef = db.collection('saloonVisitors');
        const query = await visitorsRef.where('ip', '==', ip).limit(1).get();

        if (query.empty) {
            // New visitor - add to database
            await visitorsRef.add({
                ip: ip,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        updateCounter();
    } catch (error) {
        console.error("Visitor tracking error:", error);
    }
}


let lastCount = 0;

async function updateCounter() {
    const snapshot = await db.collection('saloonVisitors').get();
    const count = snapshot.size;
    const counterElement = document.getElementById('visitor-count');

    if (count !== lastCount) {

        let c = 0;
        const targetCount = count;
        const counterInterval = setInterval(() => {
            c++;
            counterElement.textContent = c.toString();
            if (c >= targetCount) clearInterval(counterInterval);
        }, 150);

        lastCount = count;

        // Whiskey celebration animation
        celebrateWithWhiskey(count);

        // Animate gears
        document.querySelector('.counter-gears').style.animationDuration =
            `${Math.max(3 - count / 10, 0.5)}s`;
    }
}

function celebrateWithWhiskey(count) {
    initAudio();

    const overlay = document.querySelector('.whiskey-overlay');

    // Different messages based on milestones
    const messages = {
        5: "Keep 'em coming!",
        10: "Now we're talking!",
        15: "The good stuff!",
        20: "SALOON'S FULL!"
    };

    overlay.textContent = messages[count] || `${count} cowboys!`;

    // Animation sequence
    overlay.style.opacity = '1';
    setTimeout(() => {
        overlay.style.opacity = '0';
    }, 2000);

    // Play a pouring sound if available
    const pourSound = new Tone.Player({
        url: "www/sounds/whiskey-pour.mp3",
        autostart: true,
        volume: -10
    }).toDestination();
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    countVisitor();
    setInterval(updateCounter, 10000); // Update every 10 seconds
});