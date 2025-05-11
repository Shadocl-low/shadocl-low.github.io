<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>З Днем матері!</title>
    <link rel="stylesheet" href="style.css">
    <script defer src="script.js"></script>
</head>
<body>

<div class="container">
    <h1>❤️ З Днем матері! ❤️</h1>
    <p>Листівка найкращій мамі</p>
    <button onclick="showMessage()">Переглянути привітання</button>
    <div id="message" class="hidden">
        <p>Дякую тобі за все, що ти для нас робиш, ти найраща мама! 💐</p>
        <a id="download-link" href="Vinnytsia.7z" download style="display: inline-block;">скачати вірус</a>
    </div>
</div>

<div class="image-container">
    <img src="images/cat.webp" alt="Анімоване зображення" class="animated-image">
    <img src="images/cat.webp" alt="Анімоване зображення" class="animated-image">
    <img src="images/cat.webp" alt="Анімоване зображення" class="animated-image">
    <img src="images/cat.webp" alt="Анімоване зображення" class="animated-image">
</div>

<script>
    function showMessage() {
        document.getElementById("message").classList.toggle("hidden");
    }
</script>
</body>
</html>
