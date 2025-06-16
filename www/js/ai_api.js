const { OpenAI } = require('openai');

const api = new OpenAI({
    baseURL: 'https://api.aimlapi.com/v1',
    apiKey: 'Bearer <YOUR_API_KEY>',
});

const main = async () => {
    const result = await api.chat.completions.create({
        model: 'google/gemma-3n-e4b-it',
        messages: [
            {
                "role": "user",
                "content": ""
            }
        ],
        temperature: 0.7,
        top_p: 0.7,
        frequency_penalty: 1,
        max_output_tokens: undefined,
        top_k: 50,
    });

    const message = result.choices[0].message.content;
    console.log(`Assistant: ${message}`);
};

main();