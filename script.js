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
