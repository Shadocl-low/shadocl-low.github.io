document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.audio-player').forEach(player => {
        const audio = player.querySelector('audio');
        const btn = player.querySelector('.play-btn');
        const progress = player.querySelector('.progress');
        const durationEl = player.querySelector('.duration');

        audio.src = audio.dataset.audio;

        if (!audio || !btn || !progress || !durationEl) return; // проверка на null

        btn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                btn.textContent = '⏸';
            } else {
                audio.pause();
                btn.textContent = '▶';
            }
        });

        audio.addEventListener('timeupdate', () => {
            const percent = (audio.currentTime / audio.duration) * 100;
            progress.style.width = percent + '%';

            const minutes = Math.floor(audio.currentTime / 60);
            const seconds = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
            durationEl.textContent = `${minutes}:${seconds}`;
        });

        audio.addEventListener('ended', () => {
            btn.textContent = '▶';
            progress.style.width = '0%';
        });
    });
});
