const playerHorse = document.getElementById('player-horse');
const house = document.getElementById('house');
const resultDiv = document.getElementById('result');
let playerPosition = window.innerWidth / 2;
let lives = 5;
let score = 0;

function startGame() {
    document.addEventListener('keydown', movePlayer);
    setInterval(updateGame, 20);
    setInterval(moveHouse, 5000); // Cambia la posición de la casita cada 5 segundos
}

function movePlayer(event) {
    if (event.key === 'ArrowLeft') {
        playerPosition -= 10;
    } else if (event.key === 'ArrowRight') {
        playerPosition += 10;
    }
    updatePlayerPosition();
}

function updatePlayerPosition() {
    const minLeft = 0;
    const maxLeft = window.innerWidth - playerHorse.offsetWidth;
    playerPosition = Math.min(Math.max(playerPosition, minLeft), maxLeft);
    playerHorse.style.left = playerPosition + 'px';

    // Verifica si el jugador está cerca de la casa y otorga una vida extra
    if (isPlayerNearHouse()) {
        giveExtraLife();
    }
}

function moveHouse() {
    const randomPosition = Math.floor(Math.random() * (window.innerWidth - 20));
    house.style.left = randomPosition + 'px';
}

function isPlayerNearHouse() {
    const playerRect = playerHorse.getBoundingClientRect();
    const houseRect = house.getBoundingClientRect();

    // Verifica si el jugador está cerca de la casa
    return (
        playerRect.bottom > houseRect.top &&
        playerRect.top < houseRect.bottom &&
        playerRect.right > houseRect.left &&
        playerRect.left < houseRect.right
    );
}

function giveExtraLife() {
    // Otorga una vida extra al jugador y actualiza la interfaz
    lives++;
    resultDiv.textContent = `Puntuación: ${score} | Vidas: ${lives}`;

    // Cambia la posición de la casa después de otorgar una vida extra
    moveHouse();
}

function spawnEnemy() {
    const enemyType = Math.random() < 0.2 ? 'umbrella' : 'obstacle';
    const enemy = document.createElement('div');
    enemy.className = enemyType;

    // Cambia el emoji del obstáculo por el emoji del meteorito
    enemy.innerHTML = enemyType === 'umbrella' ? '☂️' : '💫';

    // Posición aleatoria en el eje X
    const randomPosition = Math.floor(Math.random() * (window.innerWidth - 10));
    enemy.style.left = randomPosition + 'px';

    enemy.style.top = 0;
    document.body.appendChild(enemy);

    moveEnemy(enemy, enemyType);
}

function moveEnemy(enemy, type) {
    const speed = type === 'obstacle' ? 5 : 2;
    const enemyInterval = setInterval(() => {
        const enemyTop = parseInt(getComputedStyle(enemy).top);
        enemy.style.top = enemyTop + speed + 'px';

        if (enemyTop > window.innerHeight) {
            enemy.remove();
            clearInterval(enemyInterval);
        }

        if (collisionDetection(playerHorse, enemy)) {
            if (type === 'umbrella') {
                // Player caught an umbrella, no life lost
                enemy.remove();
            } else {
                loseLife();
                enemy.remove();
            }
        }
    }, 20);
}

function collisionDetection(player, enemy) {
    const playerRect = player.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();
    const houseRect = house.getBoundingClientRect();

    if (enemy.classList.contains('obstacle')) {
        // Perder vida si colisiona con un obstáculo
        return (
            playerRect.bottom > enemyRect.top &&
            playerRect.top < enemyRect.bottom &&
            playerRect.right > enemyRect.left &&
            playerRect.left < enemyRect.right
        );
    } else if (enemy.classList.contains('umbrella')) {
        // No perder vida si colisiona con una sombrilla
        return false;
    } else if (enemy.classList.contains('house')) {
        // No perder vida si colisiona con la casa (ya que se maneja la lógica por separado)
        return false;
    }
}

function loseLife() {
    lives--;
    if (lives === 0) {
        endGame();
    }
}

function updateGame() {
    spawnEnemy();
    score++;
    resultDiv.textContent = `Puntuación: ${score} | Vidas: ${lives}`;
}

function endGame() {
    resultDiv.textContent = `¡Has perdido todas tus vidas! Puntuación final: ${score}`;
    document.removeEventListener('keydown', movePlayer);
    alert('¡Juego terminado! Has perdido todas tus vidas. Puntuación final: ' + score);
}

// Inicia el juego al cargar la página
startGame();
