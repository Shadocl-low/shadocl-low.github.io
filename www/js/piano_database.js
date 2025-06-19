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

                // Update melody sequence
                await db.addToArray('saloon', 'pianoMelody', 'sequence', note);
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
                const melody = doc?.currentSequence || [];
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
        const progress = (melody.length / 7) * 100;
        document.querySelector('.progress-fill').style.width = `${progress}%`;

        // Check for completion
        //if (melody.length >= 7 && this.checkCorrectSequence(melody)) {
        //    this.revealSecret();
        //}
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const pianoPuzzle = new PianoPuzzle();
    pianoPuzzle.init();
});