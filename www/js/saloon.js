// Додавання ефекту вибору напою
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
        drinkElement.style.left = (rect.left + rect.width/2) + 'px';
        drinkElement.style.top = (rect.top) + 'px';

        document.body.appendChild(drinkElement);

        // Анімація руху до бічної панелі
        const random = Math.floor(Math.random()*4)+1;
        const to_table = `.table-${random}`;

        console.log(to_table);

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

// Додавання звукових ефектів при наведенні
document.querySelectorAll('.game-button, .drink-item, .back-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        // В реальному додатку тут був би звуковий ефект
        console.log("Hover sound effect");
    });
});

// Імітація звукового супроводу
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // В реальному додатку тут був би звук салуну
        console.log("Saloon ambient sound started");
    }, 1000);
});