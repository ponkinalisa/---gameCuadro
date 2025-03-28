// Глобальные переменные
var playerName = localStorage.getItem('username') || 'Игрок';
let gameInterval;
let wallsInterval;
let batteriesInterval;
// Глобальные переменные
var timeElapsed = 0;
var powerLevel = 50;
var wallWidth = 50;
var batteryWidth = 30;
const playerSpeed = 15;
var win = false;
var stop_all = false;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('player').style.left = '10px';
});


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

function WallTop() {
    let x = Math.floor(Math.random() * 10);
    if (x % 2){
        return 1;
    }
    return 0;
  }


function start(){
    player = document.getElementById('player-name').value;
    if (!player) {
        btn.style.filter = 'grayscale(1)';
    }else{
        btn.style.filter = 'grayscale(0)';
    }

}
// Функция для старта игры
function startGame(){
    let player = document.getElementById('player-name').value;
    if (!player) {
        btn.style.filter = 'grayscale(1)';
        return
    }
    btn.style.filter = 'grayscale(0)';
    localStorage.setItem('username', player);
    playerName = player;

    // Показываем игровое поле
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    // Обновляем имя игрока
    document.getElementById('name').innerText = playerName;

    // Запуск таймера и генерация препятствий
    gameInterval = setInterval(updateTimer, 1000);
    wallsInterval = setInterval(generateWall, 2000);

    // Управление игроком
    document.addEventListener('keydown', movePlayer);
}

// Обновление таймера
function updateTimer() {
    if (stop_all == false){
        timeElapsed++;
    }
    let minutes = Math.floor(timeElapsed / 60);
    let seconds = timeElapsed % 60;
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    if (stop_all == false){
        powerLevel--;
    }
    if (powerLevel <= 0){
        endGame(true); // если игрок потерал весь заряд - экран результатов
    }
    document.getElementById('timer').innerText = `${minutes}:${seconds}`;
    document.getElementById('power').innerText = `Заряд: ${powerLevel}%`;
}

// Генерация стен
function generateWall() {
    if (stop_all == false){
        const wall = document.createElement('div');
        wall.classList.add('wall');
        wall.style.right = '0';
        let height = getRandomInt(100, 500);
        wall.style.height = `${height}px`;
        let x = WallTop();
        if (x){
            wall.style.top = `0px`;
        }else{
            wall.style.top = `${700 - height}px`;
        }
        document.getElementById('game-container').appendChild(wall);
        generateBattery();
    
        animateWall(wall);
    }
}

// Анимация движения стен
function animateWall(wall) {
    const speed = 4; // Скорость падения стен
    let frame = 0;
    const wallInterval = setInterval(() => {
    if (frame === 450) { // Убираем стену через определенное количество кадров
        clearInterval(wallInterval);
        wall.remove();
    } else {
        if (stop_all == false){
            wall.style.right = `${frame * speed}px`;
            checkCollision(wall);
            frame++;
        }
    }
    }, 17); // Частота обновления ~60 FPS
}


// Генерация аккумуляторов
function generateBattery() {
    if (stop_all == false){
        const battery = document.createElement('div');
        battery.classList.add('battery');
        battery.style.top = `${getRandomInt(20, window.innerHeight - 80)}px`;
        battery.style.right = `-200px`;
        document.getElementById('game-container').appendChild(battery);

        animateBattery(battery);

    }
}

// Анимация движения аккумуляторов
function animateBattery(battery) {
    const speed = 4; // Скорость падения аккумуляторов
    let frame = 0;
    const batteryInterval = setInterval(() => {
    if (frame === 450) { // Убираем аккумулятор через определенное количество кадров
        clearInterval(batteryInterval);
        battery.remove();
    } else {
        if (!stop_all){
            battery.style.right = `${frame * speed - 200}px`;
            checkBatteryCollision(battery);
            frame++;
        }
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
        powerLevel += 5; // Увеличение уровня мощности
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
            if (!win){
                endGame(false); // Проигрыш
            }
    }
}

// Движение игрока
function movePlayer(event) {
    event.preventDefault();
    console.log(event.key.toLowerCase());
    switch (event.key.toLowerCase()) {
        case 'escape':
            if (stop_all == true){
                stop_all = false;
            }else{
                stop_all = true;
            }
            break;
        case 'w': // Left arrow key
            moveUp();
            break;
        case 's': // Right arrow key
            moveDown();
            break;
    }
}

function moveUp() {
    if (stop_all == false){
        const player = document.getElementById('player');;
        let currentTop = parseInt(window.getComputedStyle(player).top);
        if (currentTop > 15) {
           player.style.top = `${currentTop - playerSpeed}px`;
        }
    }
}


function moveDown() {
    if (stop_all == false){
        const player = document.getElementById('player');
        let currentTop = parseInt(window.getComputedStyle(player).top);
        if (currentTop < (window.innerHeight - player.offsetHeight - 20)) {
            player.style.top = `${currentTop + playerSpeed}px`;
        }
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
    if (powerLevel <= 0){
        document.getElementById('gameover-message').innerText = 'У вас закончился заряд!';
    }
    document.getElementById('gameover-restart').onclick = restartGame;
}

// Перезагрузка игры
function restartGame() {
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('gameover-screen').style.display = 'none';
    // Глобальные переменные
    timeElapsed = 0;
    powerLevel = 50;
    startGame();
}


const input = document.getElementById('player-name');
const btn = document.getElementById('btn-start');

input.addEventListener('input', start);
input.addEventListener('change', start);
start();
