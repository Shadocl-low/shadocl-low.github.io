// Initialize all audio components
let audioContextStarted = false;

// Sound effects
const sounds = {
    piano: new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.3,
            release: 0.5
        },
        volume: -10
    }).toDestination(),

    gunshot: new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 5,
        oscillator: { type: "square" },
        envelope: {
            attack: 0.001,
            decay: 0.4,
            sustain: 0.01,
            release: 0.4,
            attackCurve: "exponential"
        }
    }).toDestination(),

    beerPour: new Tone.Player({
        url: "www/sounds/beer-pour.mp3",
        autostart: false
    }).toDestination(),

    cardShuffle: new Tone.Player({
        url: "www/sounds/card-shuffle.mp3",
        autostart: false
    }).toDestination(),

    ambiance: new Tone.Player({
        url: "www/sounds/blaze.mp3",
        loop: true,
        autostart: false,
        volume: -20
    }).toDestination()
};

// Initialize audio on first interaction
function initAudio() {
    if (!audioContextStarted) {
        Tone.start();
        audioContextStarted = true;
        console.log("Audio context started");
    }
}

// Setup all interactive elements
function setupInteractions() {
    // Piano keys
    document.getElementById('piano').addEventListener('click', () => {
        initAudio();
        const notes = ['C4', 'E4', 'G4', 'C5'];
        const note = notes[Math.floor(Math.random() * notes.length)];
        sounds.piano.triggerAttackRelease(note, "8n");
    });

    // Beer mug
    document.getElementById('beer-mug').addEventListener('click', () => {
        initAudio();
        sounds.beerPour.start();
    });

    // Deck of cards
    document.getElementById('deck-cards').addEventListener('click', () => {
        initAudio();
        sounds.cardShuffle.start();
        if (Math.random() < 0.1) {
            document.getElementById('secret-panel').style.display = 'block';
        }
    });

    // Bullet holes
    document.querySelector('.bullet-holes').addEventListener('click', () => {
        initAudio();
        sounds.gunshot.triggerAttackRelease("C1", "16n");
    });

    // Sound toggle
    document.getElementById('sound-toggle').addEventListener('click', () => {
        initAudio();
        if (sounds.ambiance.state !== 'started') {
            sounds.ambiance.start();
            document.querySelector('.sound-icon').textContent = '🔊';
            document.querySelector('.sound-text').textContent = 'Saloon Ambience';
        } else {
            sounds.ambiance.stop();
            document.querySelector('.sound-icon').textContent = '🔇';
            document.querySelector('.sound-text').textContent = 'Sound Off';
        }
    });

    // Visitor counter
    let count = 0;
    const targetCount = Math.floor(Math.random() * 10) + 5;
    const counterInterval = setInterval(() => {
        count++;
        document.getElementById('visitor-count').textContent = count;
        if (count >= targetCount) clearInterval(counterInterval);
    }, 150);
}

// Start everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setupInteractions();

    // Logo shine effect
    const logoContainer = document.querySelector('.logo-container');
    logoContainer.addEventListener('mousemove', (e) => {
        const rect = logoContainer.getBoundingClientRect();
        logoContainer.style.setProperty('--x', `${e.clientX - rect.left}px`);
        logoContainer.style.setProperty('--y', `${e.clientY - rect.top}px`);
    });
});