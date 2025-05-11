function startCountdown(seconds = 5) {
    const overlay = document.getElementById('countdownOverlay');
    const number = document.getElementById('countdownNumber');
    const video = document.getElementById('birthdayVideo');

    overlay.style.display = 'flex';
    number.textContent = seconds;

    let count = seconds;
    const interval = setInterval(() => {
        count--;
        if (count <= 0) {
            clearInterval(interval);
            number.textContent = "БУ!";

            setTimeout(() => {
                number.textContent = "Не страшно, да?";

                setTimeout(() => {
                    number.textContent = "Лан, реально херня";

                    setTimeout(() => {
                        number.textContent = "З днем народження нашу булочку!";

                        setTimeout(() => {
                            overlay.style.display = 'none';
                            document.body.style.background = "black";

                            video.style.display = 'block';
                            video.play();

                            setTimeout(() => {
                                video.style.display = 'none';

                                overlay.style.display = 'flex';

                                setTimeout(() => {
                                    number.textContent = "Я тобі ще подаруночок скачав)";

                                    const link = document.createElement('a');
                                    link.href = 'video.mp4';        // Шлях до твого відеофайлу
                                    link.download = 'happy_birthday_video.mp4'; // Назва файлу при збереженні
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }, 3500);

                            }, 3000)
                        }, 3000)

                    }, 3500)

                }, 3500)

            }, 3500)

        } else {
            number.textContent = count;
        }
    }, 1000);
}

function animateProjectile({
                               element,
                               initialVelocity = 30,        // м/с
                               launchAngleDegMax = 45,         // градуси
                               initialHeight = 0,           // м
                               pixelsPerMeter = 50,         // пікселів на метр
                               containerHeight = 500,       // висота контейнера
                               startX = -50
                           }) {
    const g = 9.8;
    const startY = containerHeight - initialHeight * pixelsPerMeter;
    function startAnimation() {
        const launchAngleDeg = Math.random() * launchAngleDegMax;
        const angleRad = launchAngleDeg * Math.PI / 180;
        const vX = initialVelocity * Math.cos(angleRad);
        const vY = initialVelocity * Math.sin(angleRad);
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const t = (timestamp - startTime) / 1000;

            const x = vX * t;
            const y = vY * t - 0.5 * g * t * t;

            const currentX = startX + x * pixelsPerMeter;
            const currentY = startY - y * pixelsPerMeter;

            element.style.left = `${currentX}px`;
            element.style.top = `${currentY}px`;

            if (currentY >= window.screen.height) {
                // новий запуск з новим кутом
                element.style.left = `${startX}px`;
                element.style.top = `${startY}px`;
                requestAnimationFrame(startAnimation);
            } else {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    startAnimation();
}

const images = document.querySelectorAll('.animated-image');
animateProjectile({
    element: images[0],
    initialVelocity: 17,
    launchAngleDegMax: 59,
    initialHeight: -1
});
animateProjectile({
    element: images[1],
    initialVelocity: 13,
    launchAngleDegMax: 60,
    initialHeight: 5
});
animateProjectile({
    element: images[2],
    initialVelocity: -23,
    launchAngleDegMax: -50,
    startX: window.screen.width,
    initialHeight: 3
});
animateProjectile({
    element: images[3],
    initialVelocity: -19,
    launchAngleDegMax: -80,
    startX: window.screen.width,
    initialHeight: -1
});

const button = document.getElementById('funButton');
const text = document.getElementById('text');
const card = document.getElementById('text');
let clickCount = 0;

// Встановлюємо початкову позицію кнопки
let posX = window.innerWidth / 2;
let posY = window.innerHeight * 0.8;
button.style.left = `${posX}px`;
button.style.top = `${posY}px`;
button.style.transform = 'translate(-50%, -50%)';

button.addEventListener('mouseover', () => {
    if (clickCount < 5) {

        if (clickCount === 0) {
            text.innerText = "Ну да баян, і шо?";
        }
        if (clickCount === 1) {
            text.innerText = "Приколюха шо улёт";
        }
        if (clickCount === 2) {
            text.innerText = "Цей, з ніччю святковою вас вітаю";
        }
        if (clickCount === 3) {
            text.innerText = "Ще трохи поклікай, trust me";
        }
        if (clickCount === 4) {
            text.innerText = "ХАХАХА, НАЇБАВ";
            document.body.classList.toggle('flip');
            card.classList.toggle('flip');
        }



        const maxOffset = 750; // обмеження переміщення
        let offsetX = (Math.random() - 0.5) * 2 * maxOffset;
        let offsetY = (Math.random() - 0.5) * 2 * maxOffset;

        // Обчислюємо нову позицію
        let newX = posX + offsetX;
        let newY = posY + offsetY;

        // Перевіряємо межі
        const buttonWidth = button.offsetWidth;
        const buttonHeight = button.offsetHeight;

        newX = Math.max(buttonWidth / 2, Math.min(window.innerWidth - buttonWidth / 2, newX));
        newY = Math.max(buttonHeight / 2, Math.min(window.innerHeight - buttonHeight / 2, newY));

        posX = newX;
        posY = newY;

        button.style.left = `${posX}px`;
        button.style.top = `${posY}px`;
        button.style.transform = 'translate(-50%, -50%)';

        clickCount++;
    } else if (clickCount === 5) {
        text.innerText = "Лан, кнопка твоя...";

        button.classList.add('disabled');
        button.style.transition = 'transform 30s ease, left 30s ease, top 30s ease';
        button.style.left = '50%';
        button.style.top = '30%';
        button.style.transform = 'translate(-50%, -50%)';
        clickCount++;

        setTimeout(() => {
            button.addEventListener('click', event => {
                document.body.classList.toggle('flip');
                card.classList.toggle('flip');

                startCountdown(5);
            })
        button.classList.remove("disabled")}, 30000);
    }
});

