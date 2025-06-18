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
        beerMug.style.transform = 'rotate(20deg)';
        setTimeout(() => { beerMug.style.transform = ''; }, 500);
    });

    // Deck of cards interaction
    const deckCards = document.getElementById('deck-cards');
    deckCards.addEventListener('click', () => {
        deckCards.style.transform = 'translateX(10px) rotate(10deg)';
        setTimeout(() => { deckCards.style.transform = ''; }, 300);
        // 10% chance to reveal secret panel
        if (Math.random() < 0.1) {
            document.getElementById('secret-panel').style.display = 'block';
        }
    });

    // Sound toggle
    const soundToggle = document.getElementById('sound-toggle');
    let audio = new Audio('www/audio/saloon-ambience.mp3');
    audio.loop = true;

    soundToggle.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            soundToggle.querySelector('.sound-icon').textContent = '🔊';
            soundToggle.querySelector('.sound-text').textContent = 'Saloon Ambience';
        } else {
            audio.pause();
            soundToggle.querySelector('.sound-icon').textContent = '🔇';
            soundToggle.querySelector('.sound-text').textContent = 'Sound Off';
        }
    });

    // Visitor counter animation
    let count = 0;
    const targetCount = Math.floor(Math.random() * 20) + 5; // Random "visitors"
    const counter = document.getElementById('visitor-count');
    const counterInterval = setInterval(() => {
        count++;
        counter.textContent = count;
        if (count >= targetCount) clearInterval(counterInterval);
    }, 150);
});

function playNote(note) {
    const synth = new Tone.Synth().toDestination();
    synth.volume.value = -10;
    synth.triggerAttackRelease(note, "8n");
}