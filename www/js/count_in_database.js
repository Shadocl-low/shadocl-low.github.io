import FirestoreDB from "./FirestoreDB.js";

let ip;

// Audio initialization remains the same
let audioContextStarted = false;

function initAudio() {
    if (!audioContextStarted) {
        Tone.start();
        audioContextStarted = true;
    }
}

// Initialize the singleton (no need to config here - it's in the class)
const db = new FirestoreDB();

async function initializeIp() {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    ip = await ipResponse.json().ip;
}

// Unique visitor counter with real-time updates
async function countVisitor() {
    try {
        // Get client IP
        await db.registerVisitor();

        // Start real-time counter updates
        await setupRealTimeCounter();

    } catch (error) {
        console.error("Visitor tracking error:", error);
        // Fallback to localStorage if Firebase fails
        fallbackCounter();
    }
}

// Real-time counter with Firestore listener
async function setupRealTimeCounter() {
    // Listen to the metadata document
    db.listenToDoc('saloonVisitors', ip, (doc) => {
        if (doc && doc.count) {
            animateCounterUpdate(doc.count);
        }
    });
}

// Optimized counter animation
let currentDisplayCount = 0;
let targetDisplayCount = 0;
let animationFrame;

function animateCounterUpdate(newCount) {
    targetDisplayCount = newCount;

    if (!animationFrame) {
        const animate = () => {
            if (currentDisplayCount < targetDisplayCount) {
                currentDisplayCount++;
                document.getElementById('visitor-count').textContent = currentDisplayCount.toString();

                // Dynamic gear speed
                const gears = document.querySelector('.counter-gears');
                gears.style.animationDuration = `${Math.max(3 - currentDisplayCount/10, 0.5)}s`;

                // Celebrate milestones
                if ([5, 10, 15, 20].includes(currentDisplayCount)) {
                    celebrateWithWhiskey(currentDisplayCount);
                }

                animationFrame = requestAnimationFrame(animate);
            } else {
                animationFrame = null;
            }
        };
        animate();
    }
}

// Enhanced celebration with error handling
function celebrateWithWhiskey(count) {
    try {
        initAudio();

        const overlay = document.querySelector('.whiskey-overlay');
        const messages = {
            5: "Keep 'em coming!",
            10: "Now we're talking!",
            15: "The good stuff!",
            20: "SALOON'S FULL!"
        };

        overlay.textContent = messages[count] || `${count} cowboys!`;
        overlay.style.opacity = '1';

        // Auto-hide after delay
        setTimeout(() => {
            overlay.style.opacity = '0';
        }, 2000);

        // Play sound with fallback
        try {
            const pourSound = new Tone.Player({
                url: "www/sounds/whiskey-pour.mp3",
                autostart: true,
                volume: -10
            }).toDestination();
        } catch (audioError) {
            console.log("Audio skipped in background tab");
        }

    } catch (error) {
        console.error("Celebration error:", error);
    }
}

// Fallback counter using localStorage
function fallbackCounter() {
    const storedCount = localStorage.getItem('fallbackVisitorCount') || 0;
    const newCount = parseInt(storedCount) + 1;
    localStorage.setItem('fallbackVisitorCount', newCount.toString());
    animateCounterUpdate(newCount);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initializeIp().catch(error => console.log(error));
    countVisitor().catch(error => console.log(error));

    // Backup interval in case listener fails
    setInterval(() => {
        db.getDoc('saloonVisitors', ip).then(doc => {
            if (doc && doc.count) {
                animateCounterUpdate(doc.count);
            }
        });
    }, 10000); // Check every 10 seconds
});