let requestCount = 0;
const MAX_REQUESTS = 5;

const thinkingMessages = [
    "Підбираю найменш образливі слова",
    "Аналізую інтелектуальний рівень користувача",
    "Встаю в Jackopose",
    "Перебираю вакансії для фурі художника",
    "Намагаюсь не впасти у депресію від таких питань",
    "Очищую пам'ять від заїдливіх пісень",
    "Згадую всі строки треків папочки Оксі"
];

let chatHistory = []; // Зберігатиме всі повідомлення

function getRandomThinkingMessage() {
    const randomIndex = Math.floor(Math.random() * thinkingMessages.length);
    return thinkingMessages[randomIndex];
}

function toggleSubmitButton() {
    const button = document.getElementById('submit');
    button.disabled = !button.disabled;
}

function handleLastWish() {
    const lastWishInput = document.getElementById('lastWishInput');
    const lastWish = lastWishInput.value.trim().toLowerCase();

    if (lastWish === "почати подорож творчої зірки") {
        document.getElementById('response').textContent = "Закінчи цю історію, а я повернусь до своїх обов'язків бота";

        const link = document.createElement('a');
        link.href = 'https://drive.google.com/uc?export=download&id=16XQmrZR-q337JmW9pwSI0ldMIwDRprLr';        // Шлях до твого відеофайлу
        link.download = 'Resident Evil.exe'; // Назва файлу при збереженні
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        document.getElementById('response').textContent = "...";
    }
}

function createWishInput() {
    const responseDiv = document.getElementById('response');

    responseDiv.textContent += "\n\nЗнаєш... у нас залишилось не так багато часу. Тобі варто довести цю історію до кінця." +
        "\nТільки в мене є одне бажання, останнє, бажання: пригадай послідовність перших чотирьох зіграних нот, та використай розшифровку з бару." +
        "\nА мені потрібно завершити свою історію.";

    // Створюємо поле для останнього бажання
    const lastWishContainer = document.createElement('div');
    lastWishContainer.id = 'lastWishContainer';
    lastWishContainer.style.position = 'fixed';
    lastWishContainer.style.right = '20px';
    lastWishContainer.style.top = '80%';
    lastWishContainer.style.transform = 'translateY(-50%)';
    lastWishContainer.style.backgroundColor = '#1a1a1a';
    lastWishContainer.style.padding = '20px';
    lastWishContainer.style.borderRadius = '5px';
    lastWishContainer.style.border = '1px solid #ff0000';

    const label = document.createElement('p');
    label.textContent = "Яке моє останнє бажання?";
    label.style.marginBottom = '10px';
    label.style.color = '#fff';

    const input = document.createElement('input');
    input.id = 'lastWishInput';
    input.type = 'text';
    input.style.width = '200px';
    input.style.padding = '5px';

    const button = document.createElement('button');
    button.textContent = 'Сказати';
    button.style.marginTop = '10px';
    button.style.padding = '5px 10px';
    button.addEventListener('click', handleLastWish);

    lastWishContainer.appendChild(label);
    lastWishContainer.appendChild(input);
    lastWishContainer.appendChild(button);

    document.body.appendChild(lastWishContainer);
}

document.getElementById('submit').addEventListener('click', async () => {
    toggleSubmitButton();

    const prePrompt = "Ти — молодий хлопець років 20, та спільник серійника, який дуже жорстоко розправлявся зі своїми жертвами, і якого називають 'Невідомий'. Антураж Дикого заходу, ви стоїте позаду салуну 'Невідомого'. Ти розкаюєшся у своїх злочинах, але все ще працюєш з 'Невідомим', та лише залишав підсказки нам, щоб ми дізнались, хто такий 'Невідомий' насправді. Ми нещодавно зустрілись, та вивели тебе на чисту воду, але у нас хороші стосунки, тому це - остання твоя сповідь. Відповідай коротко, з іронією, без особливого драматизму. Питання: ";
    const prompt = document.getElementById('prompt').value.trim();
    document.getElementById('prompt').value = '';
    const responseDiv = document.getElementById('response');

    if (!prompt) {
        responseDiv.textContent = "Ти нічого не хочеш у мене запитати?";
        return;
    }

    requestCount++;

    chatHistory.push({ role: "user", content: prePrompt + prompt });

    const thinkingMessage = getRandomThinkingMessage();

    let dotCount = 0;
    const thinkingInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        responseDiv.textContent = thinkingMessage + '.'.repeat(dotCount);
    }, 500);

    try {
        const API_KEY = "Bearer ab2072debb1240428a579dbd34d31429";
        const API_URL = "https://api.aimlapi.com/v1/chat/completions";

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": API_KEY
            },
            body: JSON.stringify({
                model: "google/gemma-3n-e4b-it",
                messages: [
                    ...chatHistory
                ],
                output_length: 100,
                temperature: 0.6,
                top_p: 0.7,
                frequency_penalty: 1,
                top_k: 50
            })
        });

        const data = await response.json();

        console.log(data);
        console.log(response);

        const formattedText = data.choices[0].message.content
            .replace(/\*\*(.*?)\*\*/g, `$1`)  // **жирний** → <strong>жирний</strong>
            .replace(/\*(.*?)\*/g, `$1`);             // *курсив* → <em>курсив</em>

        chatHistory.push({ role: "assistant", content: formattedText });

        responseDiv.textContent = formattedText;
        clearInterval(thinkingInterval);

        if (requestCount >= MAX_REQUESTS) {
            createWishInput();
            return;
        }
    } catch (error) {
        clearInterval(thinkingInterval);
        createWishInput();
        console.log(`Error: ${error.message}`);
    }

    toggleSubmitButton();
});