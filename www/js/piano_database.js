import FirestoreDB from "./FirestoreDB.js";

let audioContextStarted = false;

function initAudio() {
    if (!audioContextStarted) {
        Tone.start();
        audioContextStarted = true;
    }
}

// Initialize the singleton DB instance
const db = new FirestoreDB();

// Piano puzzle manager
class PianoPuzzle {
    constructor() {
        this.userNote = null;
        this.melodyUnsubscribe = null;
    }

    // Initialize piano interaction
    init() {
        const miniPiano = document.getElementById('mini-piano');
        if (!miniPiano) {
            console.error("Mini piano element not found!");
            return;
        }

        const fullPiano = document.getElementById('fullscreen-piano');
        const closeBtn = document.querySelector('.piano-close');
        if (!fullPiano || !closeBtn) {
            console.error("Piano elements missing!");
            return;
        }

        // Open piano
        miniPiano.addEventListener('click', () => this.openPiano());

        // Close piano
        closeBtn.addEventListener('click', () => this.closePiano());

        this.initKeys();
    }

    initKeys() {
        const keys = document.querySelectorAll('.key');

        // Key listeners
        keys.forEach(key => {
            key.addEventListener('mousedown', async () => {
                const note = key.dataset.note;
                this.playNote(note);
                key.classList.add('active');

                await handleNotePress(note);
            });

            key.addEventListener('mouseup', () => {
                key.classList.remove('active');
            });

            key.addEventListener('mouseleave', () => {
                key.classList.remove('active');
            });
        });
    }

    // Open piano with real-time updates
    openPiano() {
        document.getElementById('fullscreen-piano').style.display = 'flex';

        // Subscribe to melody updates
        this.melodyUnsubscribe = db.listenToDoc(
            'saloon',
            'pianoMelody',
            (doc) => {
                const melody = doc?.sequence || [];
                this.updateMelodyDisplay(melody);
            }
        );
    }

    // Clean up on close
    closePiano() {
        document.getElementById('fullscreen-piano').style.display = 'none';
        if (this.melodyUnsubscribe) {
            this.melodyUnsubscribe();
        }
    }

    // Tone.js note player
    playNote(note) {
        initAudio(); // Ensure audio context is ready

        const synth = new Tone.Synth({
            oscillator: {
                type: "triangle" // Western saloon sound
            },
            envelope: {
                attack: 0.01,
                decay: 0.1,
                sustain: 0.3,
                release: 0.5
            },
            volume: -10
        }).toDestination();

        synth.triggerAttackRelease(note, "8n");
    }

    // Update display with current melody
    updateMelodyDisplay(melody) {
        const display = document.getElementById('collective-notes');
        display.innerHTML = melody.map(n =>
            `<span class="${n === this.userNote ? 'user-highlight' : ''}">${n}</span>`
        ).join(' - ');

        // Update progress
        const progress = (melody.length / 10) * 100;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
    }
}

async function handleNotePress(note) {
    try {
        // Отримуємо правильну послідовність і поточний стан
        const correctSequence = await db.getMelodyCorrectSequence();
        const currentSequence = await db.getMelodySequence();

        // Правильна нота - додаємо до sequence
        await db.addToArray('saloon', 'pianoMelody', 'sequence', note);

        // Якщо послідовність завершена (дорівнює correctSequence)
        if (currentSequence.length === 10) {
            let isCorrect = true;
            for (let i = 0; i < 10; i++) {
                if (currentSequence[i] !== correctSequence[i]) {
                    isCorrect = false;
                    break;
                }
            }

            if (isCorrect) {
                console.log("Послідовність введена правильно!");
                // Update win state in Firestore
                await db.updateDoc('saloon', 'playersState', { win: true });
            }
        }
    } catch (error) {
        console.error("Помилка при обробці ноти:", error);
    }
}

function setupWinListener() {
    return db.listenToDoc('saloon', 'playersState', (doc) => {
        if (doc?.win) {
            triggerWinAnimation();
        }
    });
}

function triggerWinAnimation() {
    document.getElementById('fullscreen-piano').style.display = 'none';

    const secretButton = document.getElementById('secret-button');
    const hiddenButton = document.getElementById('hidden-button');
    const logo = document.getElementById('interactive-logo');
    const logoBasePath = 'www/img/logos/ColtonBar%20Logo'; // Base path without number and extension
    const frameCount = 5; // Number of animation frames (logo1.png, logo2.png, etc.)
    const frameDuration = 600; // Time between frames in ms
    const gunshotSound = new Tone.Player({
        url: "www/sounds/gun-shot.mp3",
        volume: -8
    }).toDestination();

    let currentFrame = 1;

    // Animation interval
    const animationInterval = setInterval(() => {
        // Update logo source
        logo.src = `${logoBasePath}${currentFrame}.png`;

        // Play gunshot sound (with slight randomization)
        gunshotSound.start();
        gunshotSound.playbackRate = 0.9 + Math.random() * 0.2;

        // Advance to next frame or end animation
        currentFrame++;
        if (currentFrame > frameCount) {
            clearInterval(animationInterval);

            secretButton.classList.add('show-secret-button');
            hiddenButton.style.opacity = '1';
            hiddenButton.style.display = 'block';

            // Add click handler
            secretButton.addEventListener('click', () => {
                console.log("Secret button clicked!");
                // Add your secret functionality here
            });
        }
    }, frameDuration);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const pianoPuzzle = new PianoPuzzle();
    pianoPuzzle.init();

    setupWinListener();
});