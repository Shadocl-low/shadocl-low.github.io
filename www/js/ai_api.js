document.getElementById('submit').addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value.trim();
    const responseDiv = document.getElementById('response');

    if (!prompt) {
        responseDiv.textContent = "Please enter a prompt!";
        return;
    }

    responseDiv.textContent = "Thinking...";

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
        responseDiv.textContent = data.choices[0].message.content;
    } catch (error) {
        responseDiv.textContent = `Error: ${error.message}`;
    }
});