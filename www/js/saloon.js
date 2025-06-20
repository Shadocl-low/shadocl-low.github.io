// Глобальні змінні для звуків
let saloonMusic;
let soundCache = {};

// Функція для завантаження звуків
async function loadSounds() {
    try {
        // Завантажуємо всі необхідні звуки
        const soundsToLoad = {
            'saloon-ambient': '/www/sounds/blaze.mp3',
            'drink-select': '/www/sounds/drink-select.mp3',
            'hover-sound': '/www/sounds/hover-sound.mp3'
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
            soundCache['saloon-ambient'].volume.value = -15;
            soundCache['saloon-ambient'].start();
        });
    } else {
        soundCache['saloon-ambient'].loop = true;
        soundCache['saloon-ambient'].volume.value = -15;
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
document.querySelectorAll('.drink-item').forEach(item => {
    item.addEventListener('click', function() {
        // Знімаємо виділення з усіх напоїв
        document.querySelectorAll('.drink-item').forEach(drink => {
            drink.style.border = '1px solid var(--primary-color)';
            drink.style.boxShadow = 'none';
        });

        // Виділяємо обраний напій
        this.style.border = '2px solid var(--accent-color)';
        this.style.boxShadow = '0 0 15px rgba(156, 61, 46, 0.5)';

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