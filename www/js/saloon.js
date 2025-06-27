// Глобальні змінні для звуків
let soundCache = {};

// Функція для завантаження звуків
async function loadSounds() {
    try {
        // Завантажуємо всі необхідні звуки
        const soundsToLoad = {
            'saloon-ambient': '/www/sounds/105.mp3',
            'drink-select': '/www/sounds/drink-select.mp3',
            'hover-sound': '/www/sounds/hover-sound.mp3',
            'laugh': '/www/sounds/laugh.ogg',
            'blood': '/www/sounds/175.mp3'
        };

        // Створюємо проміси для завантаження кожного звуку
        const loadPromises = Object.entries(soundsToLoad).map(([name, url]) => {
            return new Promise((resolve) => {
                soundCache[name] = new Tone.Player({
                    url: url,
                    onload: () => {
                        console.log(`${name} loaded`);
                        soundCache[name].toDestination();
                        resolve();
                    },
                    onerror: (e) => {
                        console.error(`Error loading ${name}:`, e);
                        resolve(); // Все одно виконуємо проміс, щоб не блокувати завантаження
                    }
                });
            });
        });

        // Чекаємо, поки всі звуки завантажаться
        await Promise.all(loadPromises);
        console.log('All sounds loaded');

        // Тепер можна безпечно стартувати музику
    } catch (error) {
        console.error('Error loading sounds:', error);
    }
}

// Функція для запуску фонової музики
function startAmbientMusic() {
    if (!soundCache['saloon-ambient']) return;

    // Перевіряємо стан аудіоконтексту
    if (Tone.context.state !== 'running') {
        Tone.context.resume().then(() => {
            soundCache['saloon-ambient'].loop = true;
            soundCache['saloon-ambient'].volume.value = -12;
            soundCache['saloon-ambient'].start();
        });
    } else {
        soundCache['saloon-ambient'].loop = true;
        soundCache['saloon-ambient'].volume.value = -12;
        soundCache['saloon-ambient'].start();
    }
}

// Функція для відтворення звуку
function playSound(name, volume = -20) {
    if (!soundCache[name]) {
        console.warn(`Sound ${name} not loaded`);
        return;
    }

    // Перевіряємо стан аудіоконтексту
    if (Tone.context.state !== 'running') {
        Tone.context.resume().then(() => {
            soundCache[name].volume.value = volume;
            soundCache[name].start();
        });
    } else {
        soundCache[name].volume.value = volume;
        soundCache[name].start();
    }
}

// Ініціалізація при завантаженні сторінки
window.addEventListener('DOMContentLoaded', () => {
    // Починаємо завантаження звуків
    loadSounds();


    // Додаємо обробник для кнопки звуку
    document.getElementById('sound-toggle').addEventListener('click', () => {
        const soundIcon = document.querySelector('.sound-icon');
        const soundText = document.querySelector('.sound-text');

        if (soundIcon.textContent === '🔇') {
            soundIcon.textContent = '🔊';
            soundText.textContent = 'Sound On';
            startAmbientMusic();
        } else {
            soundIcon.textContent = '🔇';
            soundText.textContent = 'Sound Off';
            if (soundCache['saloon-ambient']) {
                soundCache['saloon-ambient'].stop();
            }
        }
    });
});

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.querySelectorAll('.drink-item').forEach(item => {
    item.addEventListener('click', async function() {
        const soundIcon = document.querySelector('.sound-icon');
        // Знімаємо виділення з усіх напоїв
        document.querySelectorAll('.drink-item').forEach(drink => {
            drink.style.border = '1px solid var(--primary-color)';
            drink.style.boxShadow = 'none';
        });

        // Виділяємо обраний напій
        this.style.border = '2px solid var(--accent-color)';
        this.style.boxShadow = '0 0 15px rgba(156, 61, 46, 0.5)';

        if (this.dataset.name === "laugh") {
            if (soundIcon.textContent !== '🔇') {
                if (soundCache['saloon-ambient']) {
                    soundCache['saloon-ambient'].stop();
                }
            }

            const div = document.createElement('div');
            div.classList.add("laugh-container");
            const image = document.createElement('img');
            image.src = `/www/img/like.png`;
            image.style.borderRadius = '50%'; // Makes the image rounded
            image.style.width = '600px'; // Adjust size as needed
            image.style.height = '600px'; // Adjust size as needed
            image.style.objectFit = 'cover'; // Ensures the image fills the circle

            div.appendChild(image);
            document.body.appendChild(div);

            playSound('laugh', +5);

            // Click to close (optional)
            div.addEventListener('click', () => {
                document.body.removeChild(div);
                soundCache['laugh'].stop();
                if (soundIcon.textContent !== '🔇') {
                    startAmbientMusic();
                }
            });

            return;
        }

        if (this.dataset.name === "blood") {
            if (soundIcon.textContent !== '🔇') {
                if (soundCache['saloon-ambient']) {
                    soundCache['saloon-ambient'].stop();
                }
            }

            playSound(`blood`, -12);

            // Create dark overlay with random darkness
            const darkOverlay = document.createElement('div');
            darkOverlay.classList.add('dark-overlay');
            darkOverlay.style.backgroundColor = `rgba(0, 0, 0, ${0.7 + Math.random() * 0.3})`;
            document.body.appendChild(darkOverlay);

            // Create blood container
            const bloodContainer = document.createElement('div');
            bloodContainer.classList.add('blood-container');
            document.body.appendChild(bloodContainer);

            // Random blood parameters
            const bloodCount = 10; // 5-15 splatters
            const bloodTypes = 6; // Number of blood spatter images you have
            const duration = 5000 + Math.random() * 5000; // 5-10 seconds total

            for (let i = 0; i < bloodCount; i++) {
                setTimeout(() => {
                    const blood = document.createElement('div');
                    blood.classList.add('blood-spot');

                    // Random properties
                    const size = 100 + Math.random() * 200; // 20-120px
                    const rotation = Math.random() * 360;
                    const bloodType = Math.floor(Math.random() * bloodTypes) + 1;
                    const delay = Math.random() * 1000; // Stagger appearance
                    const xPos = 10 + Math.random() * 80; // Avoid edges (10-90vw)
                    const yPos = 10 + Math.random() * 80; // Avoid edges (10-90vh)
                    const opacity = 0.5 + Math.random() * 0.5; // 0.5-1.0

                    blood.style.backgroundImage = `url('/www/img/blood/scary/blood${bloodType}.png')`;
                    blood.style.width = `${size}px`;
                    blood.style.height = `${size}px`;
                    blood.style.left = `${xPos}vw`;
                    blood.style.top = `${yPos}vh`;
                    blood.style.opacity = '0';
                    blood.style.transform = `
                translate(-50%, -50%) 
                rotate(${rotation}deg) 
                scale(${0.2 + Math.random() * 0.3})`; // Start small

                    bloodContainer.appendChild(blood);

                    // Animate appearance
                    setTimeout(() => {
                        blood.style.transition = `
                    opacity ${1 + Math.random()}s ease-out,
                    transform ${1 + Math.random()}s ease-out`;
                        blood.style.opacity = opacity;
                        blood.style.transform = `
                    translate(-50%, -50%) 
                    rotate(${rotation + (Math.random() * 60 - 30)}deg) 
                    scale(${0.8 + Math.random() * 0.4})`;
                    }, delay);

                    // Animate disappearance
                    setTimeout(() => {
                        blood.style.transition = `opacity ${1 + Math.random() * 2}s ease-in`;
                        blood.style.opacity = '0';
                        setTimeout(() => blood.remove(), 2000);
                    }, 2000 + Math.random() * 3000);
                }, i * 200); // Spread creation over time

                await wait(1000);
            }

            // Cleanup
            setTimeout(() => {
                darkOverlay.style.opacity = '0';
                bloodContainer.style.opacity = '0';
                setTimeout(() => {
                    darkOverlay.remove();
                    bloodContainer.remove();
                }, 2000);
            }, duration);

            await wait(9000);

            if (soundIcon.textContent !== '🔇') {
                startAmbientMusic();
            }

            return;
        }

        // Відтворення звуку вибору напою
        playSound('hover-sound', -10);

        // Створення анімації руху напою до гравця
        const drinkIcon = this.querySelector('.drink-icon').textContent;
        const drinkElement = document.createElement('div');
        drinkElement.textContent = drinkIcon;
        drinkElement.style.position = 'fixed';
        drinkElement.style.fontSize = '2rem';
        drinkElement.style.zIndex = '1000';
        drinkElement.style.pointerEvents = 'none';

        // Початкова позиція (над кнопкою)
        const rect = this.getBoundingClientRect();
        drinkElement.style.left = (rect.left + rect.width/4) + 'px';
        drinkElement.style.top = (rect.top) + 'px';

        document.body.appendChild(drinkElement);

        // Анімація руху до бічної панелі
        const random = Math.floor(Math.random()*4)+1;
        const to_table = `.table-${random}`;

        const target = document.querySelector(to_table);
        const targetRect = target.getBoundingClientRect();

        const animation = drinkElement.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${targetRect.left - rect.left}px, ${targetRect.top - rect.top}px)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        });

        // Видалення елемента після завершення анімації
        animation.onfinish = () => {
            document.body.removeChild(drinkElement);
        };
    });
});

// Оновлений код для наведення
document.querySelectorAll('.game-button, .drink-item, .back-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        playSound('drink-select', -20);
    });
});