import FirestoreDB from "./FirestoreDB.js";
const db = new FirestoreDB();
async function initApp() {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const {ip} = await ipResponse.json();

    // Спроба зайняти сторінку (якщо вона ще вільна)
    await db.claimPersonalPage(ip);
}

document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо елементи
    const posters = document.querySelectorAll('.patron-card');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const cancelButtons = document.querySelectorAll('.cancel-btn');

    // Додаємо обробники кліків на постерах
    posters.forEach((poster, index) => {
        poster.addEventListener('click', function() {
            // Відкриваємо відповідне модальне вікно
            const modalId = `poster${index+1}-modal`;
            document.getElementById(modalId).style.display = 'block';

            // Додаємо звуковий ефект
            //const clickSound = new Tone.Player({
            //    url: "www/sounds/poster-click.mp3",
            //    volume: -15
            //}).toDestination();
            //clickSound.autostart = true;
        });
    });

    // Додаємо обробники закриття модальних вікон
    function closeModal(modal) {
        modal.style.display = 'none';
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Закриваємо модальне вікно при кліку поза ним
    window.addEventListener('click', function(event) {
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Обробка кнопки Підтвердити
    document.querySelectorAll('.confirm-btn').forEach(button => {
        button.addEventListener('click', async function() {
            const modal = this.closest('.modal');
            const textarea = modal.querySelector('textarea');
            const enteredText = textarea.value.trim().toLowerCase();

            // Тут ви можете зробити щось з введеним текстом
            console.log(`Введений текст: ${enteredText}`);

            // Закриваємо модальне вікно
            closeModal(modal);

            // Відтворюємо звук підтвердження
            //const confirmSound = new Tone.Player({
            //    url: "www/sounds/confirm.mp3",
            //    volume: -10
            //}).toDestination();
            //confirmSound.autostart = true;

            if (modal.id === "poster1-modal" && enteredText === "истинная виноградная лоза") {
                await initApp();

                window.location.href = "https://shadocl-low.github.io/saloon/me";
            }
            else if (modal.id === "poster2-modal" && enteredText === "земледелец") {
                window.location.href = "https://shadocl-low.github.io/saloon/dictionary";
            }
        });
    });
});