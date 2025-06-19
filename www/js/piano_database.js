import FirestoreDB from "./FirestoreDB.js";


// Initialize the singleton DB instance
const db = new FirestoreDB();

// Piano puzzle manager
class PianoPuzzle {
    constructor() {
        this.userNote = null;
        this.userId = this.generateUserId(); // Or get from your auth system
        this.melodyUnsubscribe = null;
    }

    // Generate a semi-permanent user ID
    generateUserId() {
        let userId = localStorage.getItem('pianoUserId');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('pianoUserId', userId);
        }
        return userId;
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

        const keys = document.querySelectorAll('.key');

        // Set up user's unique note
        this.userNote = this.assignUserNote(this.userId);
        document.getElementById('user-note').textContent = this.userNote;

        // Open piano
        miniPiano.addEventListener('click', () => this.openPiano());

        // Close piano
        closeBtn.addEventListener('click', () => this.closePiano());

        // Key listeners
        keys.forEach(key => {
            key.addEventListener('click', () => {
                const note = key.dataset.note;
                if (note === this.userNote) {
                    this.playUserNote(note);
                }
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

    // Handle note playing
    async playUserNote(note) {
        try {
            // Visual feedback
            document.getElementById('user-note').classList.add('played');
            setTimeout(() => {
                document.getElementById('user-note').classList.remove('played');
            }, 500);

            // Play sound
            this.playNote(note);

            // Add to shared melody
            const success = await db.addToArray(
                'saloon',
                'pianoMelody',
                'currentSequence',
                note
            );

            if (!success) {
                console.warn("Failed to update melody");
            }
        } catch (error) {
            console.error("Note play error:", error);
        }
    }

    // Audio playback
    playNote(note) {
        initAudio(); // Your existing audio initializer
        const synth = new Tone.Synth({
            oscillator: { type: "triangle" },
            envelope: {
                attack: 0.005,
                decay: 0.2,
                sustain: 0.3,
                release: 0.1
            }
        }).toDestination();
        synth.triggerAttackRelease(note, "8n");
    }

    // Assign note based on user ID
    assignUserNote(userId) {
        const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
        const hash = Array.from(userId).reduce((acc, char) =>
            acc + char.charCodeAt(0), 0);
        return notes[hash % notes.length];
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
        if (melody.length >= 7 && this.checkCorrectSequence(melody)) {
            this.revealSecret();
        }
    }

    // Verify melody matches target
    checkCorrectSequence(melody) {
        const target = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"]; // Your target melody
        return melody.slice(0, 7).every((note, i) => note === target[i]);
    }

    // Puzzle completion reward
    revealSecret() {
        // Example: Show hidden content
        document.getElementById('secret-map').style.display = 'block';

        // Play victory sound
        const synth = new Tone.PolySynth().toDestination();
        synth.triggerAttackRelease(["C4", "E4", "G4", "B4"], "2n");

        // Mark as solved in DB (prevent repeats)
        db.updateDoc('saloon', 'puzzleState', { pianoSolved: true });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const pianoPuzzle = new PianoPuzzle();
    pianoPuzzle.init();
});