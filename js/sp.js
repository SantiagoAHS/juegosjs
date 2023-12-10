let mensaje;
let contadorAciertos = 0;

function adivinar(id) {
    const bolita = document.getElementById('bolita');

    // Verifica si la bolita está en el vaso seleccionado
    if (bolita.classList.contains(id)) {
        // Muestra la bolita
        bolita.style.display = 'block';
        contadorAciertos++;
        mensaje.innerText = `¡Encontraste la bolita! 🎉 (${contadorAciertos} aciertos seguidos)`;

        // Después de 1 segundo, reinicia el juego
        setTimeout(() => {
            reiniciarJuego();
        }, 1000);
    } else {
        // Reinicia el contador en caso de error
        contadorAciertos = 0;
        mensaje.innerText = "Intenta de nuevo. 😢";

        // Después de 1 segundo, reinicia el juego
        setTimeout(() => {
            reiniciarJuego();
        }, 1000);
    }
}

function reiniciarJuego() {
    // Reinicia el mensaje
    mensaje.innerText = "";

    // Oculta la bolita
    document.getElementById('bolita').style.display = 'none';

    // Elimina la clase actual y agrega una nueva clase a una posición aleatoria
    const vasoAleatorio = Math.floor(Math.random() * 3) + 1;
    const bolita = document.getElementById('bolita');
    bolita.classList.remove('vaso1', 'vaso2', 'vaso3');
    bolita.classList.add(`vaso${vasoAleatorio}`);
}

document.addEventListener("DOMContentLoaded", () => {
    mensaje = document.getElementById("mensaje");

    // Inicia el juego al cargar la página
    reiniciarJuego();
});
