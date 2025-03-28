// Глобальные переменные
let playerName = '';
let gameInterval;
let wallsInterval;
let batteriesInterval;
let timeElapsed = 0;
let powerLevel = 100;
const wallWidth = 40;
const batteryWidth = 30;
const playerSpeed = 7;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('player').style.left = 'calc(50% - 30px)';
});

// Функция для старта игры
function startGame() {
    // Получаем имя игрока
    playerName = document.getElementById('player-name').value || 'Игрок';
    if (!playerName.trim()) {
        alert('Пожалуйста, введите ваше имя.');
        return;
    }

    // Показываем игровое поле
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    // Обновляем имя игрока
    document.getElementById('name').innerText = playerName;

    // Запуск таймера и генерация препятствий
    gameInterval = setInterval(updateTimer, 1000);
    wallsInterval = setInterval(generateWall, 3000);
    batteriesInterval = setInterval(generateBattery, 7000);

    // Управление игроком
    document.addEventListener('keydown', movePlayer);
}

// Обновление таймера
function updateTimer() {
    timeElapsed++;
    const minutes = Math.floor(timeElapsed / 60);
    let seconds = timeElapsed % 60;
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    document.getElementById('timer').innerText = `${minutes}:${seconds}`;
}

// Генерация стен
function generateWall() {
    const wall = document.createElement('div');
    wall.classList.add('wall');
    wall.style.top = '0';
    wall.style.left = `${Math.random() * (window.innerWidth - wallWidth)}px`;
    document.getElementById('game-container').appendChild(wall);

    animateWall(wall);
}

// Анимация движения стен
function animateWall(wall) {
    const speed = Math.random() * 3 + 2; // Скорость падения стен
    let frame = 0;
    const wallInterval = setInterval(() => {
        if (frame === 120) { // Убираем стену через определенное количество кадров
            clearInterval(wallInterval);
            wall.remove();
        } else {
            wall.style.top = `${frame * speed}px`;
            checkCollision(wall);
            frame++;
        }
    }, 17); // Частота обновления ~60 FPS
}

// Генерация аккумуляторов
function generateBattery() {
    const battery = document.createElement('div');
    battery.classList.add('battery');
    battery.style.top = '0';
    battery.style.left = `${Math.random() * (window.innerWidth - batteryWidth)}px`;
    document.getElementById('game-container').appendChild(battery);

    animateBattery(battery);
}

// Анимация движения аккумуляторов
function animateBattery(battery) {
    const speed = Math.random() * 3 + 2; // Скорость падения аккумуляторов
    let frame = 0;
    const batteryInterval = setInterval(() => {
        if (frame === 120) { // Убираем аккумулятор через определенное количество кадров
            clearInterval(batteryInterval);
            battery.remove();
        } else {
            battery.style.top = `${frame * speed}px`;
            checkBatteryCollision(battery);
            frame++;
        }
    }, 17); // Частота обновления ~60 FPS
}

// Проверка столкновения с батареей
function checkBatteryCollision(battery) {
    const playerRect = document.getElementById('player').getBoundingClientRect();
    const batteryRect = battery.getBoundingClientRect();

    if (playerRect.left <= batteryRect.right &&
        playerRect.right >= batteryRect.left &&
        playerRect.top <= batteryRect.bottom &&
        playerRect.bottom >= batteryRect.top) {
        powerLevel += 20; // Увеличение уровня мощности
        if (powerLevel > 100) {
            powerLevel = 100;
        }
        document.getElementById('power').innerText = `Заряд: ${powerLevel}%`;
        battery.remove(); // Удаляем аккумулятор
    }
}

// Проверка столкновения со стеной
function checkCollision(wall) {
    const playerRect = document.getElementById('player').getBoundingClientRect();
    const wallRect = wall.getBoundingClientRect();

    if (playerRect.left <= wallRect.right &&
        playerRect.right >= wallRect.left &&
        playerRect.top <= wallRect.bottom &&
        playerRect.bottom >= wallRect.top) {
        endGame(false); // Проигрыш
    }
}

// Движение игрока
function movePlayer(event) {
    event.preventDefault();
    switch (event.keyCode) {
        case 37: // Left arrow key
            moveLeft();
            break;
        case 39: // Right arrow key
            moveRight();
            break;
    }
}

function moveLeft() {
    const player = document.getElementById('player');
    let currentLeft = parseInt(window.getComputedStyle(player).left);
    if (currentLeft > 0) {
        player.style.left = `${currentLeft - playerSpeed}px`;
    }
}

function moveRight() {
    const player = document.getElementById('player');
    let currentLeft = parseInt(window.getComputedStyle(player).left);
    if (currentLeft < window.innerWidth - player.offsetWidth) {
        player.style.left = `${currentLeft + playerSpeed}px`;
    }
}

// Завершение игры
function endGame(win) {
    clearInterval(gameInterval);
    clearInterval(wallsInterval);
    clearInterval(batteriesInterval);

    if (win) {
        showResultScreen();
    } else {
        showGameOverScreen();
    }
}

// Показ экрана результатов
function showResultScreen() {
    document.getElementById('result-screen').style.display = 'block';
    document.getElementById('result-name').innerText = playerName;
    document.getElementById('result-time').innerText = document.getElementById('timer').innerText;
    document.getElementById('restart-button').onclick = restartGame;
}

// Показ экрана проигрыша
function showGameOverScreen() {
    document.getElementById('gameover-screen').style.display = 'block';
    document.getElementById('gameover-message').innerText = 'Вы столкнулись со стеной!';
    document.getElementById('gameover-restart').onclick = restartGame;
}

// Перезагрузка игры
function restartGame() {
    location.reload();
}