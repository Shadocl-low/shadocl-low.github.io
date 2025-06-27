function createVideoPlayer(src) {
    const videoContainer = document.createElement('div');
    videoContainer.id = 'video-corner';

    // Додаємо відео-елемент
    const video = document.createElement('video');
    video.controls = true;
    video.autoplay = true;
    video.loop = true;
    video.muted = true; // Автовідтворення потребує muted

    // Додаємо кнопку закриття
    const closeBtn = document.createElement('button');
    closeBtn.id = 'close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => {
        videoContainer.remove();
    };

    // Додаємо джерела відео (можна додати кілька форматів для сумісності)
    const source1 = document.createElement('source');
    source1.src = src;
    source1.type = 'video/mp4';

    video.appendChild(source1);
    videoContainer.appendChild(video);
    videoContainer.appendChild(closeBtn);

    document.body.appendChild(videoContainer);

    // Спроба автоматичного відтворення (з обробником помилок)
    video.play().catch(error => {
        console.log('Автовідтворення заблоковано:', error);
        video.controls = true; // Показуємо елементи управління
    });
}

// Запускаємо при завантаженні сторінки
window.addEventListener('DOMContentLoaded', () => createVideoPlayer(`/www/videos/saloon_enter.mp4`));