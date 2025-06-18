const thinkingMessages = [
    "Підбираю найменш образливі слова",
    "Аналізую інтелектуальний рівень користувача",
    "Встаю в Jackopose",
    "Перебираю вакансії для фурі художника",
    "Намагаюсь не впасти у депресію від таких питань",
    "Очищую пам'ять від заїдливіх пісень",
    "Згадую всі строки треків папочки Оксі"
];

function getRandomThinkingMessage() {
    const randomIndex = Math.floor(Math.random() * thinkingMessages.length);
    return thinkingMessages[randomIndex];
}

document.getElementById('submit').addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value.trim();
    const responseDiv = document.getElementById('response');

    if (!prompt) {
        responseDiv.textContent = "Введи повідомлення, сноб(";
        return;
    }

    responseDiv.textContent = getRandomThinkingMessage();

    let dotCount = 0;
    const thinkingInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        responseDiv.textContent = getRandomThinkingMessage() + '.'.repeat(dotCount);
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
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                top_p: 0.7,
                frequency_penalty: 1,
                top_k: 50
            })
        });

        const data = await response.json();

        const formattedText = data.choices[0].message.content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // **жирний** → <strong>жирний</strong>
            .replace(/\*(.*?)\*/g, '<em>$1</em>');             // *курсив* → <em>курсив</em>

        responseDiv.textContent = formattedText;
        clearInterval(thinkingInterval);
    } catch (error) {
        responseDiv.textContent = `Error: ${error.message}`;
    }
});