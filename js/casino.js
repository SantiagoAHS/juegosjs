const symbols = ['🍒', '🍋', '🍇', '🍊', '🍉', '💴'];

let playerScore = 0;
let aiScore = 0;
let coins = 10; // Inicializamos con 10 monedas
let playerTurn = true;

function spin() {
    if (!playerTurn) {
        return; // Espera a que sea el turno del jugador
    }

    const reels = document.querySelectorAll('.reel');
    const resultDiv = document.getElementById('result');

    // Verificamos si hay suficientes monedas para jugar
    if (coins <= 0) {
        resultDiv.textContent = '¡Has perdido! Te quedaste sin monedas.';
        displayFinalResult();
        return;
    }

    let match = true; // Variable para verificar si todos los símbolos son iguales

    reels.forEach((reel, index) => {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

        reel.textContent = ''; // Limpiar contenido del carrete

        // Oculta el símbolo al inicio de la animación
        const symbol = document.createElement('div');
        symbol.classList.add('symbol');
        symbol.textContent = randomSymbol;
        reel.appendChild(symbol);

        reel.style.animation = 'none';
        setTimeout(() => {
            reel.style.animation = 'spinReel 2s ease-out 0s 1 normal';
        }, 100);

        // Muestra el símbolo cuando termina la animación
        reel.addEventListener('animationend', () => {
            symbol.style.transform = 'translateY(0)';
        }, { once: true });

        // Verifica si todos los símbolos son iguales
        if (index > 0 && symbol.textContent !== reels[index - 1].querySelector('.symbol').textContent) {
            match = false;
        }
    });

    // Actualiza la puntuación y las monedas, y muestra el resultado
    if (match) {
        coins += 1; // Ganar una moneda adicional por coincidencia
        playerScore += 100; // Otorgar 100 puntos por coincidencia
        resultDiv.textContent = `¡Has ganado! Puntuación: ${playerScore}, Monedas: ${coins}`;
    } else {
        coins -= 1; // Restar una moneda si no hay coincidencia
        resultDiv.textContent = `No hay coincidencia. Puntuación: ${playerScore}, Monedas: ${coins}`;

        // Verificar si se quedó sin monedas
        if (coins <= 0) {
            resultDiv.textContent += '\n¡Has perdido! Te quedaste sin monedas.';
            displayFinalResult();
        } else {
            // Cambiar al turno de la IA después de la jugada del jugador
            playerTurn = false;
            setTimeout(() => {
                spinAI();
            }, 2000); // Espera 2 segundos antes de que la IA gire
        }
    }
}

function spinAI() {
    const reels = document.querySelectorAll('.reel');
    const resultDiv = document.getElementById('result');

    let match = true; // Variable para verificar si todos los símbolos son iguales

    reels.forEach((reel, index) => {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

        reel.textContent = ''; // Limpiar contenido del carrete

        // Oculta el símbolo al inicio de la animación
        const symbol = document.createElement('div');
        symbol.classList.add('symbol');
        symbol.textContent = randomSymbol;
        reel.appendChild(symbol);

        reel.style.animation = 'none';
        setTimeout(() => {
            reel.style.animation = 'spinReel 2s ease-out 0s 1 normal';
        }, 100);

        // Muestra el símbolo cuando termina la animación
        reel.addEventListener('animationend', () => {
            symbol.style.transform = 'translateY(0)';
        }, { once: true });

        // Verifica si todos los símbolos son iguales
        if (index > 0 && symbol.textContent !== reels[index - 1].querySelector('.symbol').textContent) {
            match = false;
        }
    });

    // Actualiza la puntuación de la IA
    if (match) {
        aiScore += 100; // Otorgar 100 puntos por coincidencia
    }

    // Muestra el resultado de la competencia
    setTimeout(() => {
        displayResult();
        playerTurn = true; // Cambia al turno del jugador después de la jugada de la IA
    }, 2000); // Espera 2 segundos antes de mostrar el resultado
}

function displayResult() {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = `Resultados:\nTu puntuación: ${playerScore}\nPuntuación de la IA: ${aiScore}`;

    // Determina al ganador
    if (playerScore > aiScore) {
        resultDiv.textContent += '\n¡Has ganado!';
    } else if (aiScore > playerScore) {
        resultDiv.textContent += '\nLa IA ha ganado.';
    } else {
        resultDiv.textContent += '\n¡Es un empate!';
    }

    displayFinalResult();
}

function displayFinalResult() {
    // Mostrar el resultado final después de ambos turnos
    const resultDiv = document.getElementById('result');
    resultDiv.textContent += '\n¡Resultado Final!';

    // Determina al ganador
    if (playerScore > aiScore) {
        resultDiv.textContent += '\n¡Has ganado!';
    } else if (aiScore > playerScore) {
        resultDiv.textContent += '\nLa IA ha ganado.';
    } else {
        resultDiv.textContent += '\n¡Es un empate!';
    }
}
