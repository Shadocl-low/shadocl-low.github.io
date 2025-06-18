// Beer pour sound
const beerPour = new Tone.Player({
    url: "https://assets.codepen.io/21542/soda-pour.mp3",
    autostart: false
}).toDestination();

// Card shuffle sound
const cardShuffle = new Tone.Player({
    url: "https://assets.codepen.io/21542/card-shuffle.mp3",
    autostart: false
}).toDestination();

const gunshot = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 5,
    oscillator: {
        type: "square"
    },
    envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0.01,
        release: 0.4,
        attackCurve: "exponential"
    }
}).toDestination();

// Interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Track mouse for logo shine
    const logoContainer = document.querySelector('.logo-container');
    logoContainer.addEventListener('mousemove', (e) => {
        const rect = logoContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        logoContainer.style.setProperty('--x', `${x}px`);
        logoContainer.style.setProperty('--y', `${y}px`);
    });

    // Piano keys interaction
    const piano = document.getElementById('piano');
    piano.addEventListener('click', () => {
        const notes = ['C4', 'E4', 'G4', 'C5'];
        const note = notes[Math.floor(Math.random() * notes.length)];
        playNote(note);
        piano.style.transform = 'translateY(2px)';
        setTimeout(() => { piano.style.transform = ''; }, 100);
    });

    // Beer mug interaction
    const beerMug = document.getElementById('beer-mug');
    beerMug.addEventListener('click', () => {
        beerPour.start();
        beerMug.style.transform = 'rotate(20deg)';
        setTimeout(() => { beerMug.style.transform = ''; }, 500);
    });

    // Deck of cards interaction
    const deckCards = document.getElementById('deck-cards');
    deckCards.addEventListener('click', () => {
        cardShuffle.start();
        deckCards.style.transform = 'translateX(10px) rotate(10deg)';
        setTimeout(() => { deckCards.style.transform = ''; }, 300);
        // 10% chance to reveal secret panel
        if (Math.random() < 0.1) {
            document.getElementById('secret-panel').style.display = 'block';
        }
    });

    document.querySelector('.bullet-holes').addEventListener('click', () => {
        gunshot.triggerAttackRelease("C1", "16n");
    });

    // Sound toggle
    const soundToggle = document.getElementById('sound-toggle');
    let audio = new Audio('www/sounds/blaze.mp3');
    audio.loop = true;

    soundToggle.addEventListener('click', () => {
        if (audio.paused) {
            Tone.start();
            audio.start().catch(error => console.log(error));
            soundToggle.querySelector('.sound-icon').textContent = '🔊';
            soundToggle.querySelector('.sound-text').textContent = 'Saloon Ambience';
        } else {
            audio.stop();
            soundToggle.querySelector('.sound-icon').textContent = '🔇';
            soundToggle.querySelector('.sound-text').textContent = 'Sound Off';
        }
    });

    // Visitor counter animation
    let count = 0;
    const targetCount = Math.floor(Math.random() * 10) + 5; // Random "visitors"
    const counter = document.getElementById('visitor-count');
    const counterInterval = setInterval(() => {
        count++;
        counter.textContent = count.toString();
        if (count >= targetCount) clearInterval(counterInterval);
    }, 150);
});

function playNote(note) {
    const synth = new Tone.Synth({
        oscillator: {
            type: "triangle" // Western "twangy" sound
        },
        envelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.3,
            release: 0.5
        }
    }).toDestination();
    synth.volume.value = -10;
    synth.triggerAttackRelease(note, "8n");
}