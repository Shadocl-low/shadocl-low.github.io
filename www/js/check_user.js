import FirestoreDB from "./FirestoreDB.js";
const db = new FirestoreDB();

let soundCache = {};

// Функція для завантаження звуків
async function loadSounds() {
    try {
        // Завантажуємо всі необхідні звуки
        const soundsToLoad = {
            'ambient': '/www/sounds/036.mp3'
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

        // Тепер можна безпечно стартувати музику
    } catch (error) {
        console.error('Error loading sounds:', error);
    }
}

function startAmbientMusic() {
    if (!soundCache['ambient']) return;

    // Перевіряємо стан аудіоконтексту
    if (Tone.context.state !== 'running') {
        Tone.context.resume().then(() => {
            soundCache['ambient'].loop = true;
            soundCache['ambient'].volume.value = -12;
            soundCache['ambient'].start();
        });
    } else {
        soundCache['ambient'].loop = true;
        soundCache['ambient'].volume.value = -12;
        soundCache['ambient'].start();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Отримуємо IP користувача
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const {ip} = await ipResponse.json();

        // Перевіряємо доступ
        const hasAccess = await db.checkPageAccess(ip);

        if (!hasAccess) {
            // Перенаправляємо інших користувачів
            window.location.href = 'https://shadocl-low.github.io/saloon/';
            return;
        }

        document.getElementById('cipher-container').classList.remove('hidden');

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
                if (soundCache['ambient']) {
                    soundCache['ambient'].stop();
                }
            }
        });

    } catch (error) {
        console.error("Access check failed:", error);
        window.location.href = 'https://shadocl-low.github.io/saloon/';
    }
});