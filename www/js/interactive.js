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
        autostart: false,
        volume: -10
    }).toDestination(),

    cardShuffle: new Tone.Player({
        url: "www/sounds/card-shuffle.mp3",
        autostart: false,
        volume: -10
    }).toDestination(),

    ambiance: new Tone.Player({
        url: "www/sounds/blaze.mp3",
        loop: true,
        autostart: false,
        volume: -12
    }).toDestination()
};

// Initialize audio on first interaction
function initAudio() {
    if (!audioContextStarted) {
        Tone.start();
        audioContextStarted = true;
    }
}

// Setup all interactive elements
function setupInteractions() {
    // Beer mug
    document.getElementById('beer-mug').addEventListener('click', (event) => {
        initAudio();

        const mug = event.target;
        const foam = mug.querySelector('.beer-foam');

        // Tilt animation
        mug.style.transform = 'rotate(20deg)';

        // Foam bubble effect
        foam.style.opacity = '0.8';
        foam.style.transform = 'translateX(-40%) translateY(-100%) scale(1.5)';

        setTimeout(() => {
            mug.style.transform = '';
            foam.style.opacity = '0';
            foam.style.transform = 'translateX(-50%) scale(1)';
        }, 500);

        sounds.beerPour.start();
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
}

function setupCardDeck() {
    // Deck of cards
    document.getElementById('deck-cards').addEventListener('click', async () => {
        initAudio();

        const deck = document.getElementById('deck-cards');
        const cardStack = deck.querySelector('.card-stack');
        const luckyCard = deck.querySelector('.lucky-card');

        // Shuffle animation
        cardStack.style.transform = 'translateX(10px) rotate(10deg)';

        setTimeout(() => {
            cardStack.style.transform = '';
        }, 300);

        // 10% chance for lucky card
        if (Math.random() < 0.25) {
            // Show lucky card
            luckyCard.style.opacity = '1';
            luckyCard.style.bottom = '-50px';

            // Special animation
            luckyCard.animate([
                {transform: 'translateX(-50%) rotate(-10deg)'},
                {transform: 'translateX(-50%) rotate(10deg)'},
                {transform: 'translateX(-50%) rotate(0deg)'}
            ], {
                duration: 500,
                iterations: 3
            });
        }

        sounds.cardShuffle.start();
    });
}

// Start everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setupInteractions();
    setupCardDeck();

    // Logo shine effect
    const logoContainer = document.querySelector('.logo-container');
    logoContainer.addEventListener('mousemove', (e) => {
        const rect = logoContainer.getBoundingClientRect();
        logoContainer.style.setProperty('--x', `${e.clientX - rect.left}px`);
        logoContainer.style.setProperty('--y', `${e.clientY - rect.top}px`);
    });
});